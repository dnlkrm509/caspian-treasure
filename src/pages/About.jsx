import { useContext, useEffect } from "react";
import About from "../components/About/About.jsx";
import { useRouteLoaderData } from 'react-router-dom';
import CartContext from "../store/cart-context.js";

function AboutPage() {
    const data = useRouteLoaderData('root');
    console.log(data[ data.length -1 ].totalAmount)
    const cartCTX = useContext(CartContext);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        cartCTX.setCart({
            items: data,
            //totalAmount: +data[ data.length -1 ].totalAmount
        });

    }, [])

    return (
        <div>
            <About />
        </div>
    )
}

export default AboutPage;