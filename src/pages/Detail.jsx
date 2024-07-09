import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartContext from "../store/cart-context";
import Detail from "../components/Detail/Detail";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const { productId } = useParams();
    const [products, setProducts] = useState([]);

    const cartCTX = useContext(CartContext);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        async function fetchCartProduct() {
            setIsFetching(true);

            try {
                console.log('Fetching cart products from:', `${apiUrl}/api/cart-products`);
                const response = await axios.get(`${apiUrl}/api/cart-products`);
                console.log('Cart products response:', response);
                cartCTX.setCart({ 
                    items: response.data.rows, 
                    totalAmount: +response.data.rows[response.data.rows.length - 1].totalAmount 
                });
            } catch (error) {
                setError({ message: "Failed to fetch cart products." });
                console.error('Error fetching cart products:', error);
            }

            setIsFetching(false);
        }

        async function fetchAllProducts() {
            setIsFetching(true);

            try {
                console.log('Fetching products from:', `${apiUrl}/api/products`);
                const response = await axios.get(`${apiUrl}/api/products`);
                console.log('Products response:', response);
                setProducts(response.data.rows);
            } catch (error) {
                setError({ message: 'Could not fetch products.' });
                console.error('Error fetching products:', error);
            }

            setIsFetching(false);
        }

        fetchAllProducts();
        fetchCartProduct();
    }, []);

    return (
        <div>
            {isFetching && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            <Detail />    
        </div>
    )
}

export default DetailPage;