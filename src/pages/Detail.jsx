import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartContext from "../store/cart-context";

function DetailPage() {
    const { productId } = useParams();

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
            <h2>Product Detail Page</h2>
            <p>{productId}</p>
        </div>
    )
}

export default DetailPage;