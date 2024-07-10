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

function Detail ({ product, cart, productId }) {
  const [item, setItem] = useState([]);
  console.log(cart)
  useEffect(() => {
    if (cart.length > 0) {
      const newItem = cart.filter(c => c.product_id === parseInt(productId));
      setItem(newItem);
    } else {
      setItem([]);
    }
  }, [cart, productId]);

  const cartCtx = useContext(CartContext);

  const cartItemRemoveHandler = async (id) => {
    if (item.length === 0) return;

    const isExistingCartItem = item[0].product_id === parseInt(id);

    let updatedTotalAmount = +item[0].totalAmount - +item[0].price;;
    
    if (item[0].length === 0) {
      updatedTotalAmount = 0;
    }
    
    let updatedItem;

    if (isExistingCartItem) {
      const carts = await axios.get(`${apiUrl}/api/cart-products`);
      if(item[0].amount === 1) {
        try {
          const itemToDelete = carts.data.rows.find(item => item.product_id === +id);

          if (itemToDelete) {
            await axios.delete(`${apiUrl}/api/cart-products/${itemToDelete.product_id}`);
            if (carts.length === 0) {
              updatedTotalAmount = 0;
            }

                
            for (const row of carts.data.rows) {
              if (row.product_id !== parseInt(id)) {
                await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
                  totalAmount: updatedTotalAmount.toFixed(2)
                });
              }
            }

            cartCtx.removeItem(parseInt(id));
            setItem([]);
          } else {
            console.warn('Item to delete not found in the cart');
          }
        } catch (err) {
          console.error('Failed to delete data!', err);
        }
            
      } else {
        updatedItem = {...item[0], 
          amount: item[0].amount - 1};
        try {
          const itemToDelete = carts.data.rows.find(item => item.product_id === parseInt(id));
                
          await axios.put(`${apiUrl}/api/cart-products/${itemToDelete.product_id}`, {
            newProduct: updatedItem,
            totalAmount: `${updatedTotalAmount.toFixed(2)}`
          });

          for (const row of carts.data.rows) {
            await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
              totalAmount: updatedTotalAmount.toFixed(2)
            });
          }
            
          cartCtx.removeItem(parseInt(id));
          setItem([updatedItem]);
        } catch (error) {
          console.error('Failed to delete data!', error);
        }
      }









    }

      
  };

  const cartItemAddHandler = async (newItem) => {
      const isExistingCartItem = item[0]?.product_id === +newItem.id;
      let updatedTotalAmount;

  if (isExistingCartItem) {
    updatedTotalAmount = item[0].totalAmount + +newItem.price;

    try {
      const carts = await axios.get(`${apiUrl}/api/cart-products`);
      const itemToAdd = carts.data.rows.find(item => item.product_id === item[0]?.product_id);
      
      const updatedProduct = { ...newItem, amount: newItem.amount + 1 };

      if (itemToAdd) {
          const putUrl = `${apiUrl}/api/cart-products/${itemToAdd.product_id}`;
          const putData = {
              newProduct: updatedProduct,
              totalAmount: updatedTotalAmount.toFixed(2)
          };

          const response = await axios.put(putUrl, putData);
          console.log('PUT request response:', response.data);

          console.log('Successfully updated the product on the server');
      } else {
          console.error('Item to add not found in the cart');
      }


      for (const row of carts.data.rows) {
        await axios.put(`${apiUrl}/api/cart-products/${row.product_id}`, {
          totalAmount: updatedTotalAmount.toFixed(2)
        });
      }

      cartCtx.addItem({...newItem, price: +newItem.price, amount: 1});
  } catch (error) {
      
  }











  } else {}

  };

  let amount = <span className={classes.amount}>0</span>;

  if (item.length === 0) {
    return;
  } else {
    if (item[0])
      amount = <span className={classes.amount}>{item[0].amount}</span>;
  }

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
                  {amount}
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