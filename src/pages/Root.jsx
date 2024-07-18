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

export async function loader() {
  try {
    // Fetch all users
    const usersResponse = await axios.get(`${apiUrl}/api/users`);
    const users = usersResponse.data.rows;

    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    // Get the last user ID from the users list
    const userId = users[users.length - 1].id;

    // Fetch cart products for the last user
    const cartResponse = await axios.get(`${apiUrl}/api/cart-products`, {
      params: { userId }
    });

    // Return the cart products data
    return cartResponse.data.rows;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Throw a custom error response to handle in your frontend
    throw json(
      { isNextLine: true, message: 'Failed to fetch cart products.' },
      {
        status: 500,
      }
    );
  }
}