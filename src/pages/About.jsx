import { useContext, useEffect } from "react";
import About from "../components/About/About.jsx";
import { useRouteLoaderData } from 'react-router-dom';
import CartContext from "../store/cart-context.js";

function AboutPage() {
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
            <About />
        </div>
    )
}

export default AboutPage;