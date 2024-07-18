import { useContext, useEffect } from "react";
import CartContext from "../store/cart-context.js";
import { useRouteLoaderData } from 'react-router-dom';
import Checkout from "../components/Checkout/Checkout.jsx";

function CheckoutPage() {
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
            <Checkout />
        </div>
    )
}

export default CheckoutPage;