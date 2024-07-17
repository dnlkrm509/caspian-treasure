import React, {  useContext, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal/Modal";
import classes from './Cart.module.css';
import CartItem from "./CartItem";
import Checkout from "../Checkout/Checkout.jsx";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Cart = (props) => {
    const cartCtx = useContext(CartContext);
    const [isHidden, setIsHidden] = useState(true);

    const totalAmount = `£${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

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
            console.log('item to add', itemToAdd)
            
            const updatedProduct = { priduct_id: newItem, amount: existingCartItem.amount + 1 };

            if (itemToAdd) {
                const putUrl = `${apiUrl}/api/cart-products/${itemToAdd.product_id}`;
                const putData = {
                    newProduct: updatedProduct,
                    userId: cart.data.rows[ cart.data.rows.length - 1 ].user_id,
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
                totalAmount: updatedTotalAmount.toFixed(2),
                userId: cart.data.rows[ cart.data.rows.length - 1 ].user_id,
              });
            }

            cartCtx.addItem({...newItem, price: +newItem.price, amount: 1});
        } catch (error) {
            
        }

    };

    const hideFormHandler = () => {
        setIsHidden(true);
        props.onHideCart();
    };

    const showFormHandler = () => {
        setIsHidden(false);
    };

    const CartItems = <motion.ul
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ y: -30, opacity: 0 }}
                        key='list'
                        className={classes['cart-items']}
                    >
                        <AnimatePresence>
                            {cartCtx.items.map(item => (
                            <CartItem 
                                key={item.product_id}
                                price={+item.price} 
                                amount={item.amount} 
                                name={item.name} 
                                onRemove={cartItemRemoveHandler.bind(null, item.product_id)}
                                onAdd={cartItemAddHandler.bind(null, item)}
                            />
                            ))}
                        </AnimatePresence>
    </motion.ul>;

    const modalActions =  (
        <motion.div
            key='button'
            initial={{ opacity:0, y: '-1.5rem' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: '-1.5rem', opacity: 0 }}
            className={classes.actions}
        >
            <button  
                onClick={props.onHideCart}
                className={classes['button--alt']}
            >
                Close
            </button>
            {hasItems && 
                <button onClick={showFormHandler} className={classes.button}>Checkout</button>
            }
        </motion.div>
    );

    return (
            <Modal onHideCart={props.onHideCart}>
                <AnimatePresence mode="wait">
                    {isHidden ? CartItems : null}
                    <motion.div
                        key='total'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={classes.total}
                    >
                        <span>Total Amount</span>
                        <span>{totalAmount}</span>
                    </motion.div>
                    {!isHidden && <Checkout onHide={hideFormHandler} />}
                    {isHidden && modalActions}
                </AnimatePresence>
            </Modal>
    )
};

export default Cart;