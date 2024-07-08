import classes from './CartItem.module.css';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CartItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;

  return (
    <motion.li
      className={classes['cart-item']}
      layout
      exit={{ y: '-1.5rem', opacity: 0 }}
    >
      <Link to={`/product/${props.productId}`} >
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
      </Link>
    </motion.li>
  );
};

export default CartItem;