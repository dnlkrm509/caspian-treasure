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
  const [newAmount, setNewAmount] = useState(product.amount);

  const cartCtx = useContext(CartContext);
  
  useEffect(() => {
    async function fetchCartProductAmount() {
      try {
        const response = await axios.get(`${apiUrl}/api/cart-products`);
        const carts = response.data.rows;
        const existingCartItem = carts.find(item => item.product_id === +product.id);
        setNewAmount(existingCartItem.amount);

      } catch (error) {console.error(error)};
    }

    fetchCartProductAmount();
  }, [cartCtx])

  const cartItemRemoveHandler = async (id) => {
    const response = await axios.get(`${apiUrl}/api/cart-products`);
    const carts = response.data.rows;
    const existingCartItem = carts.find(item => item.product_id === +id);

    let updatedTotalAmount = +existingCartItem.totalAmount - +existingCartItem.price;;
    
    if (existingCartItem.length === 0) {
      updatedTotalAmount = 0;
    }
    
    let updatedItem;

    if (existingCartItem) {
      if(existingCartItem.amount === 1) {
        try {

          if (existingCartItem) {
            await axios.delete(`${apiUrl}/api/cart-products/${existingCartItem.product_id}`);
            if (carts.length === 0) {
              updatedTotalAmount = 0;
            }

                
            for (const row of carts) {
              if (row.product_id !== parseInt(id)) {
                await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                  totalAmount: updatedTotalAmount.toFixed(2)
                });
              }
            }

            cartCtx.removeItem(parseInt(id));
            setNewAmount(0);
          } else {
            console.warn('Item to delete not found in the cart');
          }
        } catch (err) {
          console.error('Failed to delete data!', err);
        }
            
      } else {
        updatedItem = {...existingCartItem, 
          amount: existingCartItem.amount - 1};
        try {   
          await axios.put(`${apiUrl}/api/cart-products/${existingCartItem.product_id}`, {
            newProduct: updatedItem,
            totalAmount: `${updatedTotalAmount.toFixed(2)}`
          });

          for (const row of carts) {
            await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
              totalAmount: updatedTotalAmount.toFixed(2)
            });
          }
            
          cartCtx.removeItem(parseInt(id));
          setNewAmount(updatedItem.amount);
        } catch (error) {
          console.error('Failed to delete data!', error);
        }
      }
    }
      
  };

  const cartItemAddHandler = async (newItem) => {
    const response = await axios.get(`${apiUrl}/api/cart-products`);
    const carts = response.data.rows;
    const existingCartItem = carts.find(item => item.product_id === +newItem.id);
    
    let updatedTotalAmount;

    if (existingCartItem) {
      updatedTotalAmount = +existingCartItem.totalAmount + +newItem.price;

      try {
        const updatedProduct = { ...existingCartItem, amount: existingCartItem.amount + 1 };

        const putUrl = `${apiUrl}/api/cart-products/${existingCartItem.product_id}`;
        const putData = {
            newProduct: updatedProduct,
            totalAmount: updatedTotalAmount.toFixed(2)
        };

        const response = await axios.put(putUrl, putData);
        console.log('PUT request response:', response.data);

        console.log('Successfully updated the product on the server');


        for (const row of carts) {
          await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
            totalAmount: updatedTotalAmount.toFixed(2)
          });
        }

        cartCtx.addItem({...existingCartItem, price: +newItem.price, amount: 1});
        setNewAmount(updatedProduct.amount);
    } catch (error) {
        
    }











    } else {}

  };

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
                    onClick={() => cartItemRemoveHandler(product.id)}
                    className={classes.minus}
                  >
                    -
                  </motion.button>
                  <span className={classes.amount}>{newAmount}</span>
                  <motion.button
                    whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
                    transition={{type:'spring', stiffness: 500}}
                    onClick={() => cartItemAddHandler(product)}
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
                  onClick={() => cartItemAddHandler(product)}
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