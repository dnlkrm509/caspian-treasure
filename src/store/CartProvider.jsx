import React, { useReducer } from "react";
import CartContext from "./cart-context.js";

const defaultCartState = {
    items: [],
    totalAmount: 0
};

const cartReducer = (state, action) => {
    if (action.type === 'SET') {
        const items = action.items.items;
        const totalAmount = action.items.totalAmount;
        return {
            items: items,
            totalAmount: totalAmount
        }
    }

    if (action.type === 'ADD') {
        const updatedTotalAmount = 
            state.totalAmount + action.item.price * action.item.amount;

        const existingCartItemIndex = state.items.findIndex(item => (
            item.product_id === action.item.product_id
        ));

        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItem;
        let updatedItems;

        if(existingCartItem) {
            updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount
            };
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            updatedItems = state.items.concat(action.item);
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    };

    if(action.type === 'REMOVE') {
        const existingCartItemIndex = state.items.findIndex(item => (
            item.product_id === action.product_id
        ));

        const existingCartItem = state.items[existingCartItemIndex];

        let updatedTotalAmount = state.totalAmount - existingCartItem.price;
        let updatedItems;

        if(existingCartItem.amount === 1) {
            updatedItems = state.items.filter(item => item.product_id !== action.product_id);
            if (updatedTotalAmount < 0) {
                updatedTotalAmount = 0;
            }
        } else {
            const updatedItem = {...existingCartItem, 
                amount: existingCartItem.amount - 1};
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }

    if (action.type === 'CLEAR') {
        return defaultCartState;
    }

    return defaultCartState;
};

const CartProvider = (props) => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const setCartHandler = (items) => {
        dispatchCartAction({
            type: 'SET',
            items: items
        });
    };

    const addItemToCartHandler = (item) => {
        dispatchCartAction({
            type: 'ADD',
            item: item
        });
    };

    const removeItemFromCartHandler = (product_id) => {
        dispatchCartAction({
            type: 'REMOVE',
            product_id
        });
    };

    const clearCartHandler = () => {
        dispatchCartAction({
            type: 'CLEAR'
        })
    };

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        clearCart: clearCartHandler,
        setCart: setCartHandler
    };
    
    return (
        <CartContext.Provider
            value={cartContext}
        >
            {props.children}
        </CartContext.Provider>
    )
};

export default CartProvider;