import Products from "../components/Products/Products.jsx";
import classes from './Products.module.css';
import img from '../../public/image3.jpg';
import { useContext, useEffect } from "react";
import CartContext from "../store/cart-context.js";
import axios from "axios";
import { useRouteLoaderData, json } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function ProductsPage() {
    const data = useRouteLoaderData('root');
    const cartCTX = useContext(CartContext);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (data && data.length > 0) {
          cartCTX.setCart({
            items: data,
            totalAmount: +data[data.length - 1].totalAmount
          });
        } else {
          // Handle the case where data is empty
          cartCTX.setCart({
            items: [],
            totalAmount: 0
          });
        }

    }, [data])

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

export async function loader () {
    try {
      const response = await axios.get(`${apiUrl}/api/products`);
      return response.data.rows;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw json( { isNextLine: false, button, message: 'Failed to fetch products.' }, {
        status: 500
      } )
    }
}