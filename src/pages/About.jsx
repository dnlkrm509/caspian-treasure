import { useContext, useEffect, useState } from "react";
import About from "../components/About/About.jsx";
import CartContext from "../store/cart-context.js";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function AboutPage() {
    const cartCTX = useContext(CartContext);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
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
            <About />
        </div>
    )
}

export default AboutPage;