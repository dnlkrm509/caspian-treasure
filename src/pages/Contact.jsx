import { useContext, useEffect, useState } from "react";
import Contact from "../components/Contact/Contact";
import CartContext from "../store/cart-context";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function ContactPage() {
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
            <Contact />
        </div>
    )
}

export default ContactPage;