import { useContext, useEffect } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';

import Header from "../components/HomeHeader/Header";
import CartProvider from "../store/CartProvider";
import CartContext from "../store/cart-context";
import axios from "axios";
import { useLoaderData, json } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage(props) {
  const cartCTX = useContext(CartContext);

  const data = useLoaderData();
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

  const { scrollY } = useScroll();

  const yContent = useTransform(scrollY, [550, 600, 650, 680], [0, -150, -150, -180]);
  const yContentP = useTransform(scrollY, [550, 600, 650, 680], [0, -100, -100, -120]);

  const opacityContent = useTransform(scrollY, [550, 600, 650, 680], [0, 0.6, 0.7, 1]);
  const scaleContent = useTransform(scrollY, [550, 600], [1, 1.5]);

  return (
    <CartProvider>
      <div className="container gap-8 flex flex-col">
        <Header onShowCart={props.onShowCart} />
        <div className="w-11/12 mx-auto">
          <motion.h1 style={{ y: yContent, scale: scaleContent, opacity: opacityContent }} className="text-center my-[30px]">Content</motion.h1>
          <motion.p style={{ y: yContentP, opacity: opacityContent }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare venenatis felis at pulvinar. Etiam non eleifend sapien. Pellentesque nec orci vel elit consequat laoreet. Cras id fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel imperdiet purus, eget hendrerit ipsum. Duis quis commodo purus. In diam nibh, consequat ac posuere sit amet, condimentum in odio. Maecenas ultrices id ligula nec fringilla. Aenean pellentesque ac metus vitae porttitor. Vestibulum cursus aliquet magna vitae aliquam. Aenean faucibus tellus in tortor congue interdum non ut lorem. Aliquam ut ligula ac odio tincidunt tincidunt non sit amet arcu. Sed imperdiet ligula sit amet orci viverra auctor. In quam quam, cursus nec tortor ac, placerat mollis tortor.
          </motion.p>
          <motion.p style={{ y: yContentP, opacity: opacityContent }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare venenatis felis at pulvinar. Etiam non eleifend sapien. Pellentesque nec orci vel elit consequat laoreet. Cras id fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel imperdiet purus, eget hendrerit ipsum. Duis quis commodo purus. In diam nibh, consequat ac posuere sit amet, condimentum in odio. Maecenas ultrices id ligula nec fringilla. Aenean pellentesque ac metus vitae porttitor. Vestibulum cursus aliquet magna vitae aliquam. Aenean faucibus tellus in tortor congue interdum non ut lorem. Aliquam ut ligula ac odio tincidunt tincidunt non sit amet arcu. Sed imperdiet ligula sit amet orci viverra auctor. In quam quam, cursus nec tortor ac, placerat mollis tortor.
          </motion.p>
          <motion.p style={{ y: yContentP, opacity: opacityContent }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare venenatis felis at pulvinar. Etiam non eleifend sapien. Pellentesque nec orci vel elit consequat laoreet. Cras id fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel imperdiet purus, eget hendrerit ipsum. Duis quis commodo purus. In diam nibh, consequat ac posuere sit amet, condimentum in odio. Maecenas ultrices id ligula nec fringilla. Aenean pellentesque ac metus vitae porttitor. Vestibulum cursus aliquet magna vitae aliquam. Aenean faucibus tellus in tortor congue interdum non ut lorem. Aliquam ut ligula ac odio tincidunt tincidunt non sit amet arcu. Sed imperdiet ligula sit amet orci viverra auctor. In quam quam, cursus nec tortor ac, placerat mollis tortor.
          </motion.p>
          <motion.p style={{ y: yContentP, opacity: opacityContent }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ornare venenatis felis at pulvinar. Etiam non eleifend sapien. Pellentesque nec orci vel elit consequat laoreet. Cras id fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel imperdiet purus, eget hendrerit ipsum. Duis quis commodo purus. In diam nibh, consequat ac posuere sit amet, condimentum in odio. Maecenas ultrices id ligula nec fringilla. Aenean pellentesque ac metus vitae porttitor. Vestibulum cursus aliquet magna vitae aliquam. Aenean faucibus tellus in tortor congue interdum non ut lorem. Aliquam ut ligula ac odio tincidunt tincidunt non sit amet arcu. Sed imperdiet ligula sit amet orci viverra auctor. In quam quam, cursus nec tortor ac, placerat mollis tortor.
          </motion.p>
        </div>
      </div>
    </CartProvider>
  );
}

export default HomePage;

export async function loader() {
  try {
    let users = await axios.get(`${apiUrl}/api/users`);

    if (!users.data.rows || users.data.rows.length === 0) {
      throw new Error('No users found');
    }

    const userId = users.data.rows[users.data.rows.length - 1].id;

    const carts = await axios.get(`${apiUrl}/api/cart-products`, {
      params: { userId }
    });

    return carts.data.rows;
  } catch (error) {
    console.error('Failed to fetch cart products:', error.message);
    throw json({ isNextLine: true, message: 'Failed to fetch cart products.' }, {
      status: 500
    });
  }
}