import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

import CartContext from "../../../store/cart-context.js";
import classes from './ProductItem.module.css';
import ProductItemForm from "./ProductItemForm.jsx";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ProductItem = (props) => {
    const cartCtx = useContext(CartContext);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        async function fetchCartProductAmount(){
            try {
                const response = await axios.get(`${apiUrl}/api/cart-products`);
                const cartProduct = response.data.rows.find(item => item.product_id === +props.id);
                if (cartProduct) {
                    setAmount(cartProduct.amount);
                } else {
                    setAmount(0);
                }
            } catch (err) { console.error(err) }
        }
        
        fetchCartProductAmount();

    }, [props.id]);

    const price = `£${+props.price.toFixed(2)}`;

    async function addToCartHandler(amount) {
        const description = props.description;

        const product = {
            product_id: props.id,
            name: props.name,
            amount: amount
        };

        const existingCartItemIndex = cartCtx.items.findIndex(item => item.product_id === product.product_id);
        const existingCartItem = cartCtx.items[existingCartItemIndex];
        //console.log('cart', cartCtx, 'existing cart item', existingCartItem, 'product.product_id:', product.product_id)
        const updatedTotalAmount = cartCtx.totalAmount + props.price * amount;

        try {
            if (cartCtx.items.length > 0) {
                const cart = await axios.get(`${apiUrl}/api/cart-products`);
                console.log(cart)
                if (existingCartItem) {
                    for (const row of cart.data.rows) {
                        if (row.product_id === product.product_id) {
                            const updatedProduct = { ...product, amount: existingCartItem.amount + amount };
                            await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                                newProduct: updatedProduct,
                                userId: cart.data.rows[ cart.data.rows.length - 1 ].userID,
                                totalAmount: updatedTotalAmount.toFixed(2)
                            });

                            for (const row of cart.data.rows) {
                              await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                                totalAmount: updatedTotalAmount.toFixed(2),
                                userId: cart.data.rows[ cart.data.rows.length - 1 ].userID,
                              });
                            }

                            cartCtx.addItem({ ...product, description, price: props.price });
                            break;
                        }
                    }
                } else {
                    await axios.post(`${apiUrl}/api/cart-products`, {
                        newProduct: product,
                        userId: cart.data.rows[ cart.data.rows.length - 1 ].userID,
                        totalAmount: updatedTotalAmount.toFixed(2)
                    });

                    for (const row of cart.data.rows) {
                      await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                        totalAmount: updatedTotalAmount.toFixed(2),
                        userId: cart.data.rows[ cart.data.rows.length - 1 ].userID,
                      });
                    }

                    cartCtx.addItem({ ...product, description, price: props.price });
                }
            } else {
                const response = await axios.get(`${apiUrl}/api/users`);
                const user = response.data.rows[0];

                await axios.post(`${apiUrl}/api/cart-products`, {
                    newProduct: product,
                    user,
                    totalAmount: updatedTotalAmount.toFixed(2)
                });

                cartCtx.addItem({ ...product, description, price: props.price });
            }

        } catch (error) {
            console.error('Error occurred adding product!', error);
        }
    };
    
    return (
        <li className={classes.product}>
            <Link to={`/products/${props.id}?id=${props.id}&name=${encodeURIComponent(props.name)}&description=${encodeURIComponent(props.description)}&price=${props.price}&amount=${encodeURIComponent(amount)}`} >
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