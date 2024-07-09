import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartContext from "../store/cart-context";
import Detail from "../components/Detail/Detail";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const { productId } = useParams();
    const [products, setProducts] = useState();

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

        async function fetchAllProducts () {
            setIsFetching(true);
            
            try {
              const response = await axios.get(`${apiUrl}/api/products`);
              console.log(response)
              setProducts(response.data.rows);
            } catch (error) {
              setError('Could not fetch products.' );
              console.error('Error fetching data:', error)
            }
    
            setIsFetching(false)  
        }
    


        fetchAllProducts();
        fetchCartProduct();
    }, [])

    return (
        <div>
            <Detail products={products} productId={productId} />
        </div>
    )
}

export default DetailPage;