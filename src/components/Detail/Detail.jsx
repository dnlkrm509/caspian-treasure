import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import classes from './Detail.module.css';
import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";
import axios from "axios";

let easing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing }
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing
    }
  }
};

const apiUrl = import.meta.env.VITE_API_URL;


function Detail (props) {
    const [products, setProducts] = useState();
    const [product, setProduct] = useState();
    const cartCTX = useContext(CartContext);
    setProduct(products.data.rows.find( (prod) => prod.id === +props.productId ) );

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        async function fetchAllAndCartProduct() {
        setIsFetching(true);

        try {
            const allProducts = await axios.get(`${apiUrl}/api/products`);
            setProduct(allProducts);
            const products = await axios.get(`${apiUrl}/api/cart-products`);
            cartCTX.setCart({ items: products.data.rows, totalAmount: +products.data.rows[ products.data.rows.length -1 ].totalAmount });
        } catch (error) {
            setError({ message: "Failed to fetch products." });
        }

        setIsFetching(false);
        }

        fetchAllAndCartProduct();
    }, [])
    console.log(item);
    setProduct(item);

    return (
        <motion.div initial='initial' animate='animate' exit={{ opacity: 0 }}>
            <div className={classes.fullscreen}>
            <div className={classes.product}>
                <motion.div
                className={classes.img}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}>
                {/* <motion.img
                    key={props.product.image}
                    src={props.product.image}
                    animate={{ x: 0, opacity: 1 }}
                    initial={{ x: 200, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                />
                 */}
                 </motion.div>
                <div className={classes['product-details']}>
                <motion.div variants={stagger} className={classes.inner}>
                    <Link href='/products'>
                    <motion.div variants={fadeInUp}>
                        <span className={classes['go-back']}>Back to products</span>
                    </motion.div>
                    </Link>
                    <motion.div variants={fadeInUp}>
                    <span className={classes.category}>Caviar</span>
                    </motion.div>
                    <motion.h1 variants={fadeInUp}>{product.name}</motion.h1>
                    <motion.p variants={fadeInUp}>{product.description}</motion.p>
                    <motion.div variants={fadeInUp} className={classes.additonals}>
                    <span>Soy Free</span>
                    <span>Gluten Free</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={classes['qty-price']}>
                    <div className={classes.qty}>
                        <div className={classes.minus}>-</div>
                        <div className={classes.amount}>{product.amount}</div>
                        <div className={classes.add}>+</div>
                    </div>
                    <span className={classes.price}>{product.price}</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={classes['btn-row']}>
                    <button className={classes['add-to-cart']}> Add to cart</button>
                    <button className={classes.subscribe}> Subscribe</button>
                    </motion.div>
                </motion.div>
                </div>
            </div>
            </div>
          </motion.div>

    )
}

export default Detail;