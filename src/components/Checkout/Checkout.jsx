// src/components/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
  IdealBankElement
} from '@stripe/react-stripe-js';
import axios from 'axios';
import emailjs from 'emailjs-com';

import classes from './Checkout.module.css';
import Card from '../UI/Card/Card';
import CartContext from '../../store/cart-context';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const serviceId = import.meta.env.VITE_SERVICE_ID;
const templateId = import.meta.env.VITE_TEMPLATE_ID2;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;

const apiUrl = import.meta.env.VITE_API_URL;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm = (props) => {
  const [order, setOrder] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentMethodType, setPaymentMethodType] = useState('card'); // Default payment method
  const [currency, setCurrency] = useState('gbp'); // Default currency
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'GB' // Default country to UK
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await axios.get(`${apiUrl}/api/orders`);
        setOrder(orders.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const cartCTX = useContext(CartContext);

  if (paymentSuccessful) {
    setTimeout(() => {
      if (props.onHide) {
        props.onHide();
      }
    }, 1000);
  }

  const createPaymentIntent = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/api/checkout`, {
        amount: +(+cartCTX.totalAmount.toFixed(2) * 100).toFixed(0), // Amount in pence (e.g., £10.00)
        ...customerDetails,
        paymentMethodType,
        currency
      });

      return data.clientSecret;
    } catch (error) {
      console.log('Error: ', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethodType(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly.');
      setLoading(false);
      return;
    }

    const fetchedClientSecret = await createPaymentIntent();

    if (!fetchedClientSecret) {
      return;
    }

    let paymentMethod;
    try {
      if (paymentMethodType === 'card') {
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod: cardPaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            address: {
              line1: customerDetails.address,
              city: customerDetails.city,
              state: customerDetails.state,
              postal_code: customerDetails.zip,
              country: customerDetails.country,
            },
          },
        });
        if (error) throw error;
        paymentMethod = cardPaymentMethod;
      } else if (paymentMethodType === 'ideal') {
        const idealBankElement = elements.getElement(IdealBankElement);
        const { error, paymentMethod: idealPaymentMethod } = await stripe.createPaymentMethod({
          type: 'ideal',
          ideal: idealBankElement,
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
          },
        });
        if (error) throw error;
        paymentMethod = idealPaymentMethod;
      } else {
        const { error, paymentMethod: otherPaymentMethod } = await stripe.createPaymentMethod({
          type: paymentMethodType,
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            address: {
              line1: customerDetails.address,
              city: customerDetails.city,
              state: customerDetails.state,
              postal_code: customerDetails.zip,
              country: customerDetails.country,
            },
          },
        });
        if (error) throw error;
        paymentMethod = otherPaymentMethod;
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return;
    }


    try {
      const { error: confirmError } = await stripe.confirmCardPayment(fetchedClientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }


      try {
        await axios.post(`${apiUrl}/api/users`, {
          ...customerDetails,
          password: '12345'
        });
  
        const users = await axios.get(`${apiUrl}/api/users`);

        if (!users.data.rows || users.data.rows.length === 0) {
          throw new Error('No users found');
        }
    
        // Get the last user ID from the users list
        const userId = users.data.rows[users.data.rows.length - 1].id;
        
        await axios.post(`${apiUrl}/api/customers`, {
          userId
        });
  
        const customers = await axios.get(`${apiUrl}/api/customers`);

        if (!customers.data.rows || customers.data.rows.length === 0) {
          throw new Error('No customers found');
        }
    
        // Get the last customer ID from the customers list
        const customerId = customers.data.rows[customers.data.rows.length - 1].user_id;
        
        await axios.post(`${apiUrl}/api/customers`, {
          userId: customerId
        });

        
        const ordersResponse = await axios.get(`${apiUrl}/api/orders`);
        
        if (!ordersResponse.data.rows || ordersResponse.data.rows.length === 0) {
          throw new Error('No orders found');
        }
        
        const orders = ordersResponse.data.rows;

        console.log("Fetched orders:", orders); // Debugging log

        for (const item of cartCTX.items) {
          try {
            let confirmation = null;
            if (orders[ orders.length - 1 ].confirmation !== undefined) {
              const lastOrder = orders[orders.length - 1];
              console.log("Last order fetched:", lastOrder); // Debugging log

              if (users.data.rows[users.data.rows.length - 1].email === customerDetails.email) {
                confirmation = lastOrder.confirmation;
              }
            }

            console.log("Confirmation to be used:", confirmation); // Debugging log
            
            await axios.post(`${apiUrl}/api/orders`, {
              customerId,
              confirmation
            })

            const newOrdersResponse = await axios.get(`${apiUrl}/api/orders`);
            const newOrders = newOrdersResponse.data;
            const newLastOrder = newOrders.rows[newOrders.rows.length - 1];
    
            // Get the last order ID from the orders list
            const orderId = newLastOrder.id;

            const carts = await axios.get(`${apiUrl}/api/cart-products/${userId}`);

            await axios.post(`${apiUrl}/api/order-detail`, {
              newProduct: { product_id: carts.data.rows[ carts.data.rows.length - 1 ].product_id, },
              orderId
            })

            setOrder(newOrders);



            await axios.post(`${apiUrl}/api/message-to`, {
              customerId: customerId,
              productId: item.product_id,
            })

            await axios.delete(`${apiUrl}/api/all-cart-products/${userId}/${item.product_id}`);
            
          } catch (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
          
        }

        emailjs.sendForm(serviceId, templateId, event.target, publicKey)
          .then((result) => {
            console.log(result.text);
          }, (error) => {
            console.log(error.text);
          });

          cartCTX.clearCart();

      } catch (error) {
        console.log('Error ocurred attemting to fetch orders!')
      }
  

      setPaymentSuccessful(true);
      setError(null);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setPaymentSuccessful(false);
      setLoading(false);
    }

  };

  return (
    <div className={classes["checkout-container"]}>
      <h2 className='text-center mb-[2rem]'>Checkout</h2>
      <form onSubmit={handleSubmit} className={classes["checkout-form"]}>
        <div className={classes["card-element-container"]}>
          <div className={classes["customer-details"]}>
            <label>
              Name
              <input type="text" name="name" value={customerDetails.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={customerDetails.email} onChange={handleChange} placeholder="Enter your email" required />
            </label>
            <label>
              Address
              <input type="text" name="address" value={customerDetails.address} onChange={handleChange} required />
            </label>
            <label>
              City
              <input type="text" name="city" value={customerDetails.city} onChange={handleChange} required />
            </label>
            <label>
              State
              <input type="text" name="state" value={customerDetails.state} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input type="text" name="zip" value={customerDetails.zip} onChange={handleChange} pattern="[A-Za-z0-9]{3,10}" title="Enter a valid UK postal code" required />
            </label>
            <label>
              Country
              <input type="text" name="country" value={customerDetails.country} onChange={handleChange} disabled />
            </label>
          </div>
          <div className={classes["payment-method"]}>
            <label>
              Payment Method
              <select name="paymentMethodType" value={paymentMethodType} onChange={handlePaymentMethodChange}>
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
                <option value="bacs_debit">Bacs Direct Debit</option>
                <option value="ideal">iDEAL</option>
              </select>
            </label>
            <label>
              Currency
              <select name="currency" value={currency} onChange={handleCurrencyChange}>
                <option value="gbp">GBP</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
              </select>
            </label>
            <input type="hidden" name="confirmation" value={order && order.rows.length > 0 ? order.rows[ order.rows.length - 1 ].confirmation : ''} />
            {cartCTX.items.map((item) => (
              <div key={item.product_id}>
                <input type="hidden" name="productId" value={item.product_id} ></input>
                <input type="hidden" name="productName" value={item.name} ></input>
                <input type="hidden" name="amount" value={item.amount} ></input>
                <input type="hidden" name="price" value={`£${item.price}`} ></input>
              </div>
            ))}
            <input type="hidden" name="totalAmount" value={`£${cartCTX.totalAmount.toFixed(2)}`} ></input>
          </div>
        {paymentMethodType === 'card' && (
          <div className={classes["card-element-container"]}>
            <label>
              Card Details
              <CardElement options={CARD_ELEMENT_OPTIONS} className={classes["card-element"]} />
            </label>
          </div>
        )}
        {paymentMethodType === 'ideal' && (
          <div className={classes["ideal-element-container"]}>
            <label>
              iDEAL Bank
              <IdealBankElement className={classes["ideal-element"]} />
            </label>
          </div>
        )}
        </div>
        {error && <div className={classes["error-message"]}>{error}</div>}
        <button type="submit" disabled={!stripe || loading || cartCTX.items.length === 0} className={classes["checkout-button"]}>
          {loading ? (
              <div className='flex flex-row mx-auto gap-[3rem] items-center justify-center'>
                <span className='bold text-[1.4rem]'>Processing...</span> <LoadingSpinner />
              </div>
            ) :
              `Pay £${cartCTX.totalAmount.toFixed(2)}`
          }
        </button>
        {paymentSuccessful && <div className={classes["success-message"]}>Payment Successful!</div>}
      </form>
    </div>
  );
};

const Checkout = (props) => (
  <Elements stripe={stripePromise}>
    <Card>
      <CheckoutForm onHide={props.onHide} />
    </Card>
  </Elements>
);

export default Checkout;
