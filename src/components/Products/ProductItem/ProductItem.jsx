import React, { useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';

import CartContext from "../../../store/cart-context.js";
import classes from './ProductItem.module.css';
import ProductItemForm from "./ProductItemForm.jsx";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ProductItem = (props) => {
    const cartCtx = useContext(CartContext);
    const [userId, setUserId] = useState(() => Cookies.get('userId') || '');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (!userId) {
            const newUserId = Math.random().toString();
            Cookies.set('userId', newUserId);
            setUserId(newUserId);
        }
            async function fetchCartProductAmount(){
                try {
                    const carts = await axios.get(`${apiUrl}/cart-products`);
                        const cart = carts.data.rows.find(c=> c.product_id === +props.id);
                        setAmount(cart.amount);
                } catch (err) { console.error(err) }
            }
            
            fetchCartProductAmout();
                
    }, [userId]);

    const price = `£${+props.price.toFixed(2)}`;

    async function addToCartHandler(amount) {
        const product = {
            product_id: props.id,
            name: props.name,
            amount: amount,
            description: props.description,
            price: props.price.toFixed(2)
        };

        const existingCartItemIndex = cartCtx.items.findIndex(item => item.product_id === product.product_id);
        const existingCartItem = cartCtx.items[existingCartItemIndex];
        const updatedTotalAmount = cartCtx.totalAmount + props.price * amount;

        try {
            if (cartCtx.items.length > 0) {
                const cart = await axios.get(`${apiUrl}/api/cart-products`);
                if (existingCartItem) {
                    for (const row of cart.data.rows) {
                        if (row.product_id === product.product_id) {
                            const updatedProduct = { ...product, amount: existingCartItem.amount + amount };
                            await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                                newProduct: updatedProduct,
                                totalAmount: updatedTotalAmount.toFixed(2)
                            });

                            for (const row of cart.data.rows) {
                              await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                                totalAmount: updatedTotalAmount.toFixed(2)
                              });
                            }

                            cartCtx.addItem({ ...product, price: props.price });
                            break;
                        }
                    }
                } else {
                    await axios.post(`${apiUrl}/api/cart-products`, {
                        newProduct: product,
                        cart: cart.data.rows[ cart.data.rows.length - 1 ],
                        totalAmount: updatedTotalAmount.toFixed(2)
                    });

                    for (const row of cart.data.rows) {
                      await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                        totalAmount: updatedTotalAmount.toFixed(2)
                      });
                    }

                    cartCtx.addItem({ ...product, price: props.price });
                }
            } else {
                await axios.post(`${apiUrl}/api/cart-products`, {
                    newProduct: product,
                    totalAmount: updatedTotalAmount.toFixed(2)
                });

                cartCtx.addItem({ ...product, price: props.price });
            }

        } catch (error) {
            console.error('Error occurred adding product!', error);
        }
    };
    
    return (
        <li className={classes.product}>
            <Link to={`/products/${props.id}?id=${props.id}&name=${encodeURIComponent(props.name)}&description=${encodeURIComponent(props.description)}&price=${props.price}&amount=${amount}`} >
                <div>
                    <h3>{props.name}</h3>
                    <div className={classes.description}>{props.description}</div>
                    <div className={classes.price}>{price}</div>
                </div>
            </Link>
            <div className={classes['product-form']}>
                <ProductItemForm id={props.id} onAddToCart={addToCartHandler} />
            </div>
        </li>
    );
};

export default ProductItem;