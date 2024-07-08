import { useContext, useEffect, useState } from "react";
import CartContext from "../store/cart-context.js";
import axios from "axios";
import Checkout from "../components/Checkout/Checkout.jsx";

const apiUrl = import.meta.env.VITE_API_URL;

function CheckoutPage() {
    const cartCTX = useContext(CartContext);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        async function fetchCartProduct() {
            setIsFetching(true);

            try {
                const products = await axios.get(`${apiUrl}/api/cart-products`);
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