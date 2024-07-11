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

    const [cart, setCart] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        async function fetchCartProduct() {
            setIsFetching(true);

            try {
                const products = await axios.get(`${apiUrl}/api/cart-products`);
                setCart(products);
                cartCTX.setCart({ items: products.data.rows, totalAmount: +products.data.rows[ products.data.rows.length -1 ].totalAmount });
            } catch (error) {
                setError({ message: "Failed to fetch cart products." });
            }

            setIsFetching(false);
        }

          fetchCartProduct();
          if (!cartCTX) {
            fetchCartProduct();
          }
    }, [cartCTX]);

    return (
        <div>
            {isFetching && cartCTX.items.length === 0 && <LoadingSpinner />}
            {error && <Error title='An Error occurred!' body={error.message} />}
            {!isFetching && !error && cartCTX.items.length > 0 && (
                <Detail product={product} cart={cart} productId={productId} />)}
        </div>
    )
}

export default DetailPage;