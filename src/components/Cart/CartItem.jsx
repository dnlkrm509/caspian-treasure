import classes from './CartItem.module.css';

import { motion } from 'framer-motion';

const CartItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;

  return (
    <motion.li
      className={classes['cart-item']}
      layout
      exit={{ y: '-1.5rem', opacity: 0 }}
    >
      <div>
        <h2>{props.name}</h2>
        <div className={classes.summary}>
          <span className={classes.price}>{price}</span>
          <span className={classes.amount}>x {props.amount}</span>
        </div>
      </div>
      <div className={classes.actions}>
        <motion.button
          whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
          transition={{type:'spring', stiffness: 500}}
          onClick={props.onRemove}
        >
          −
        </motion.button>
        <motion.button
          whileTap={{ scale: [0.9, 1.1, 0.9, 1] }}
          transition={{type:'spring', stiffness: 500}}
          onClick={props.onAdd}
        >
          +
        </motion.button>
      </div>
    </motion.li>
  );
};

export default CartItem;