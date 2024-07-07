import { useContext, useEffect, useState } from "react";
import CartContext from "../store/cart-context.js";
import axios from "axios";
import Checkout from "../components/Checkout/Checkout.jsx";

function CheckoutPage() {
    const cartCTX = useContext(CartContext);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchCartProduct() {
            setIsFetching(true);

            try {
                const products = await axios.get(`/api/cart-products`);
                cartCTX.setCart({ items: products.data.rows, totalAmount: +products.data.rows[ products.data.rows.length -1 ].totalAmount });
            } catch (error) {
                setError({ message: "Failed to fetch cart products." });
            }

            setIsFetching(false);
        }

        fetchCartProduct();
    }, [])

    return (
        <div>
            <Checkout />

        </div>
    )
}

export default CheckoutPage;