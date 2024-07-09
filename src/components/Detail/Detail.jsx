import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import classes from './Detail.module.css';
import { useState } from "react";

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

function Detail () {
    // const [product, setProduct] = useState({});
    // console.log(props)
    // setProduct(props.products.find((p) => p.id === +props.productId));
    // console.log('Product:', product)

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
                    <motion.h1 variants={fadeInUp}>Namw</motion.h1>
                    <motion.p variants={fadeInUp}>Description</motion.p>
                    <motion.div variants={fadeInUp} className={classes.additonals}>
                    <span>Soy Free</span>
                    <span>Gluten Free</span>
                    </motion.div>
                    <motion.div variants={fadeInUp} className={classes['qty-price']}>
                    <div className={classes.qty}>
                        <div className={classes.minus}>-</div>
                        <div className={classes.amount}>1</div>
                        <div className={classes.add}>+</div>
                    </div>
                    <span className={classes.price}>Price</span>
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