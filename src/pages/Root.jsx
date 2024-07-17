import { Outlet, json } from "react-router-dom";
import Layout from "../components/Nav/Layout.jsx";
import CartProvider from "../store/CartProvider.jsx";
import Cart from "../components/Cart/Cart.jsx";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Footer from '../components/Footer/Footer.jsx';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

function RootLayout() {
  const [cartIsShown, setCartIsShown] = useState(false);


  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

    return (
        <CartProvider>
            <AnimatePresence>
                {cartIsShown && <Cart onHideCart={hideCartHandler}/>}
            </AnimatePresence>
            <Layout onShowCart={showCartHandler} >
                <main className="text-center my-8 mx-auto mt-[20px]">
                    <Outlet onShowCart={showCartHandler} />
                </main>
                <Footer />
            </Layout>
        </CartProvider>
    )
}

export default RootLayout;

export async function loader () {
    try {
      const users = await axios.get(`${apiUrl}/api/users`);
      const response = await axios.get(`${apiUrl}/api/cart-products`, {
        params: { userId: users.data.rows[ users.data.rows.length - 1 ].id }
      });
      return response.data.rows;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw json( { isNextLine: true, message: 'Failed to fetch cart products.' }, {
        status: 500
      } )
    }
}