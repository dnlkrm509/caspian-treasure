import classes from './CartItem.module.css';

import { motion } from 'framer-motion';

const CartItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;

  return (
    <motion.li
      className={classes['cart-item']}
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
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
        <button onClick={props.onRemove}>−</button>
        <button onClick={props.onAdd}>+</button>
      </div>
    </motion.li>
  );
};

export default CartItem;