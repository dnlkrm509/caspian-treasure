import { Link } from 'react-router-dom';
import classes from './Footer.module.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

const instagram = import.meta.env.VITE_INSTAGRAM_ADDRESS;

function Footer() {
  const date = new Date();
  let year = date.getFullYear();

  return (
    <footer id="footer" className={classes.center}>
          <div>
            <motion.ul
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className={classes.list}
            >
              <motion.li
                whileTap={{ scale:[0.8, 1.1, 1] }}
                transition={{ type:'spring', stiffness:500 }}
                className={classes['list-item']}
              >
                <Link
                  className={classes['list-link']}
                  to="#"
                >
                  <span className='fa-stack fa-lg hover:text-[#535bf2]'>
                    <FontAwesomeIcon icon={faFacebookF} />
                  </span>
                </Link>
              </motion.li>
              <motion.li
                whileTap={{ scale:[0.8, 1.1, 1] }}
                transition={{ type:'spring', stiffness:500 }}
                className={classes['list-item']}>
                  <Link
                    className={classes['list-link']}
                    to={instagram}
                  >
                      <span className='fa-stack fa-lg hover:text-[#F00AC9]'>
                        <FontAwesomeIcon icon={faInstagram} />
                      </span>
                  </Link>
              </motion.li>
            </motion.ul>
            <p>© Copyright {year} Caspian Treasure Team</p>
            </div>
    </footer>
  )
}

export default Footer;