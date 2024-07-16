import { useContext, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';

import Cookies from 'js-cookie';
import Header from "../components/HomeHeader/Header";
import CartProvider from "../store/CartProvider";
import CartContext from "../store/cart-context";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage(props) {
  const cartCTX = useContext(CartContext);

  const [userId, setUserId] = useState(() => Cookies.get('userId') || '');

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  const { scrollY } = useScroll();

  const yContent = useTransform(scrollY, [550, 600, 650, 680], [0, -150, -150, -180]);
  const yContentP = useTransform(scrollY, [550, 600, 650, 680], [0, -100, -100, -120]);

  const opacityContent = useTransform(scrollY, [550, 600, 650, 680], [0, 0.6, 0.7, 1]);
  const scaleContent = useTransform(scrollY, [550, 600], [1, 1.5]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [])

  useEffect(() => {
    async function fetchCartProduct() {
      setIsFetching(true);

      try {
        const users = await axios.get(`${apiUrl}/api/users`);
        if (users.data.rows.length === 0) {
          await axios.post(`${apiUrl}/api/add-user`, {
            name:'1', password:'1', email:'1', address:'1', city:'1', state:'1',zip:'1',country:'1'
          })
          const newUsers = await axios.get(`${apiUrl}/api/users`);
          await axios.post(`${apiUrl}/api/cart-products`, { newProduct: [], userId: newUsers.id, totalAmount: '0.00' } );
        }

        const products = await axios.get(`${apiUrl}/api/cart-products`);
        console.log(products.data.rows)
        cartCTX.setCart({ items: products.data.rows, totalAmount: +products.data.rows[ products.data.rows.length -1 ].totalAmount });
      } catch (error) {
        setError({ message: "Failed to fetch cart products." });
      }

      setIsFetching(false);
    }

    fetchCartProduct();
  }, [userId])

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