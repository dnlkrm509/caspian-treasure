import React from "react";

const CartContext = React.createContext({
    items: [],
    totalAmount: 0,
    addItem: (item) => {},
    removeItem: (product_id) => {},
    setCart: ({ items, totalAmount }) => {},
    clearCart: ()=> {}
});

export default CartContext;