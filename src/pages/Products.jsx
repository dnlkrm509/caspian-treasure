import Products from "../components/Products/Products.jsx";
import Cookies from 'js-cookie';
import classes from './Products.module.css';
import img from '../../public/image3.jpg';
import { useContext, useEffect, useState } from "react";
import CartContext from "../store/cart-context.js";
import axios from "axios";

function ProductsPage() {
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
            <div className={classes['main-image']}>
                <img src={img} />
            </div>
            <main>
                <Products />
            </main>
        </div>
    )
}

export default ProductsPage;