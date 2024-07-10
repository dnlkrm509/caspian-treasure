import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import classes from './Detail.module.css';
import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";

let easing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing }
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing
    }
  }
};

const apiUrl = import.meta.env.VITE_API_URL;

function Detail ({ product, cart, productId }) {
  const [item, setItem] = useState({});

  useEffect(() => {
    if (cart.length > 0) {
      const newItem = cart.filter(c => c.product_id === +productId);
      setItem(newItem);
    }
  }, []);

  const cartCtx = useContext(CartContext);

  const cartItemRemoveHandler = async (id) => {
    const existingCartItemIndex = cartCtx.items.findIndex(item => (
      item.product_id === id
    ));

    const existingCartItem = cartCtx.items[existingCartItemIndex];
      
    let updatedTotalAmount = +cartCtx.totalAmount - existingCartItem.price;
    if (cartCtx.items.length === 0) {
      updatedTotalAmount = 0;
    }
      
    let updatedItem;

    if(existingCartItem.amount === 1) {
      try {
        const cart = await axios.get(`${apiUrl}/api/cart-products`);
        const itemToDelete = cart.data.rows.find(item => item.product_id === id);

        if (itemToDelete) {
          await axios.delete(`${apiUrl}/api/cart-products/${itemToDelete.product_id}`);
          if (cartCtx.items.length === 0) {
            updatedTotalAmount = 0;
          }

              
          for (const row of cart.data.rows) {
            if (row.product_id !== id) {
              await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                totalAmount: updatedTotalAmount.toFixed(2)
              });
            }
          }

          cartCtx.removeItem(id);
        } else {
          console.warn('Item to delete not found in the cart');
        }
      } catch (err) {
        console.error('Failed to delete data!', err);
      }
          
    } else {
      updatedItem = {...existingCartItem, 
        amount: existingCartItem.amount - 1};
      try {
        const cart = await axios.get(`${apiUrl}/api/cart-products`);
        const itemToDelete = cart.data.rows.find(item => item.product_id === id);
              
        await axios.put(`${apiUrl}/api/cart-products/${itemToDelete.product_id}`, {
          newProduct: updatedItem,
          totalAmount: `${updatedTotalAmount.toFixed(2)}`
        });

        for (const row of cart.data.rows) {
          await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
            totalAmount: updatedTotalAmount.toFixed(2)
          });
        }
          
        cartCtx.removeItem(id);
      } catch (error) {
        console.error('Failed to delete data!', error);
      }
    }

      
  };

  const cartItemAddHandler = async (newItem) => {

      const existingCartItemIndex = cartCtx.items.findIndex(item => (
          item.product_id === newItem.product_id
      ));

      const existingCartItem = cartCtx.items[existingCartItemIndex];
      const updatedTotalAmount = cartCtx.totalAmount + existingCartItem.price;

      try {
          const cart = await axios.get(`${apiUrl}/api/cart-products`);
          const itemToAdd = cart.data.rows.find(item => item.product_id === existingCartItem.product_id);
          
          const updatedProduct = { ...newItem, amount: existingCartItem.amount + 1 };

          if (itemToAdd) {
              const putUrl = `${apiUrl}/api/cart-products/${itemToAdd.product_id}`;
              const putData = {
                  newProduct: updatedProduct,
                  totalAmount: updatedTotalAmount.toFixed(2)
              };
  
              const response = await axios.put(putUrl, putData);
              console.log('PUT request response:', response.data);
  
              console.log('Successfully updated the product on the server');
          } else {
              console.error('Item to add not found in the cart');
          }


          for (const row of cart.data.rows) {
            await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
              totalAmount: updatedTotalAmount.toFixed(2)
            });
          }

          cartCtx.addItem({...newItem, price: +newItem.price, amount: 1});
      } catch (error) {
          
      }

  };

  let amount = <span className={classes.amount}>0</span>;

  if (item[0])
    amount = <span className={classes.amount}>{item[0].amount}</span>;

    return (
        <motion.div initial='initial' animate='animate' exit={{ opacity: 0 }}>
          <div className={classes.product}>
            <motion.div
              className={classes.img}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              <span>Image</span>
              {/* <motion.img
                  key={props.product.image}
                  src={props.product.image}
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: 200, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
              />
              */}
            </motion.div>
            <motion.div variants={stagger} className={classes['product-details']}>
              <Link to='..' relative='path' className={classes['go-back']}>
                <motion.button variants={fadeInUp}>
                    <span>Back to products</span>
                </motion.button>
              </Link>
              <motion.div variants={fadeInUp}>
                <h1 className={classes.category}>Caviar</h1>
              </motion.div>
              <motion.h2 variants={fadeInUp}>{product.name}</motion.h2>
              <motion.p variants={fadeInUp}>{product.description}</motion.p>
              <motion.div variants={fadeInUp} className={classes['qty-price']}>
                <div className={classes.qty}>
                  <button onClick={() => cartItemRemoveHandler(product.id)} className={classes.minus}>
                    -
                  </button>
                  {amount}
                  <button onClick={() => cartItemAddHandler(product)} className={classes.plus}>
                    +
                  </button>
                </div>
                <span className={classes.price}>{`£${product.price}`}</span>
              </motion.div>
              <motion.div variants={fadeInUp} className={classes['btn-row']}>
                <button className={classes['add-to-cart']}>Add to cart</button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
    )
}

export default Detail;