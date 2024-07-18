import { useContext, useEffect } from "react";
import Contact from "../components/Contact/Contact";
import CartContext from "../store/cart-context";
import { useRouteLoaderData } from 'react-router-dom';

function ContactPage() {
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
            <Contact />
        </div>
    )
}

export default ContactPage;