import { useParams, useLocation } from "react-router-dom";
import Detail from "../components/Detail/Detail";
import { useContext, useEffect, useState } from "react";
import CartContext from "../store/cart-context";
import axios from "axios";
import LoadingSpinner from "../components/UI/LoadingSpinner/LoadingSpinner";
import Error from '../components/UI/Error';

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const { productId } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');
    const name = query.get('name');
    const description = query.get('description');
    const price = query.get('price');

    const product = {
        id,
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        price
    }

    const cartCTX = useContext(CartContext);
    const [amount, setAmount] = useState(0);

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
    }, []);

    useEffect(() => {
        if (cartCTX.items.length > 0) {
            const cart = cartCTX.items.map(item => item.product_id === +productId);
            setAmount(cart.amount);
        } else {
            setAmount(0);
        }
    }, [cartCTX, cart])

    return (
        <div>
            {isFetching && <LoadingSpinner />}
            {error && <Error />}
            {!isFetching && !error && <Detail product={product} amount={amount} />}
        </div>
    )
}

export default DetailPage;