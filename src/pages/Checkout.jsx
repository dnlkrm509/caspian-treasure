import { useContext, useEffect } from "react";
import CartContext from "../store/cart-context.js";
import { useRouteLoaderData } from 'react-router-dom';
import Checkout from "../components/Checkout/Checkout.jsx";

function CheckoutPage() {
    const data = useRouteLoaderData('root');
    const cartCTX = useContext(CartContext);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        cartCTX.setCart({
            items: data,
            totalAmount: +data[ data.length -1 ].totalAmount
        });

    }, [])

    return (
        <div>
            <Checkout />
        </div>
    )
}

export default CheckoutPage;