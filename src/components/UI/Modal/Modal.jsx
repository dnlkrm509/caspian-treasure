import classes from './Modal.module.css';

import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export default function Modal({ children, onHideCart }) {
  return createPortal(
    <>
      <div className={classes.backdrop} onClick={onHideCart} />
      <motion.dialog
        variants={{
          hidden: { opacity: 0, y: '-3rem' },
          visible: { opacity: 1, y: 0 }
        }}
        initial='hidden'
        animate='visible'
        exit='hidden'
        open
        className={classes.modal}
      >
        {children}
      </motion.dialog>
    </>,
    document.getElementById('modal')
  );
};