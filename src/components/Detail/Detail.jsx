import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import classes from './Detail.module.css';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CartContext from "../../store/cart-context";

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

function Detail ({ product, productId }) {

  const cartCtx = useContext(CartContext);

    return (
        <motion.div initial='initial' animate='animate' exit={{ opacity: 0 }}>
          <div className={classes.product}>
            <motion.div
              className={classes.img}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              <span>Image</span>
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
            <motion.div variants={stagger} className={classes['product-details']}>
              <Link to='..' relative='path' className={classes['go-back']}>
                <motion.button variants={fadeInUp}>
                    <span>Back to products</span>
                </motion.button>
              </Link>
              <motion.div variants={fadeInUp}>
                <h1 className={classes.category}>Caviar</h1>
              </motion.div>
              <motion.h2 variants={fadeInUp}>{product.name}</motion.h2>
              <motion.p variants={fadeInUp}>{product.description}</motion.p>
              <motion.div variants={fadeInUp} className={classes['qty-price']}>
                <div className={classes.qty}>
                  <motion.button
                    whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
                    transition={{type:'spring', stiffness: 500}}
                    className={classes.minus}
                  >
                    -
                  </motion.button>
                  <span className={classes.amount}>{product.amount}</span>
                  <motion.button
                    whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
                    transition={{type:'spring', stiffness: 500}}
                    className={classes.plus}
                  >
                    +
                  </motion.button>
                </div>
                <span className={classes.price}>{`£${product.price}`}</span>
              </motion.div>
              <motion.div variants={fadeInUp} className={classes['btn-row']}>
                <motion.button
                  whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
                  transition={{type:'spring', stiffness: 500}}
                  className={classes['add-to-cart']}
                >
                  Add to cart
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
    )
}

export default Detail;