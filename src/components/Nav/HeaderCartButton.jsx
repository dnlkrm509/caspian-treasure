import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import CartContext from '../../store/cart-context.js';
import CartIcon from '../Cart/CartIcon.jsx';
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);

  const numberOfCartItems = cartCtx.items.reduce((currentNumber, item) => {
    return currentNumber + item.amount
  }, 0);


  return (
    <motion.button
      whileHover={{ scale: [0.8, 1.3, 1] }}
      transition={{ type: 'spring', stiffness: 500 }}
      onClick={props.onClick} className={classes.button}
    >
      <span className={classes.icon}>
        <CartIcon/>
      </span>
      <span className='hidden md:flex'>Your Cart</span>
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        className={classes.badge}
      >
        {numberOfCartItems}
      </motion.span>
    </motion.button>
  );
};

export default HeaderCartButton;