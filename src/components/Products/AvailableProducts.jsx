import Card from '../UI/Card/Card';
import classes from './AvailableProducts.module.css';
import ProductItem from './ProductItem/ProductItem';
import { useRouteLoaderData, json } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Error from '../UI/Error';

const apiUrl = import.meta.env.VITE_API_URL;

const AvailableProducts = () => {
    const products = useRouteLoaderData('products');

    let productsList = <li><Error title='No Products found.' isNextLine={false} /></li>;


    productsList = products.map((product) => (
      <ProductItem
        id={product.id} 
        key={product.id} 
        name={product.name} 
        description={product.description}
        price={+product.price}
      />
    ));

    return (
        
        <section className={classes.products}>
          <Card>
            <motion.ul
              initial={{ opacity: 0, y: '3rem'}}
              animate={{opacity: 1, y: 0}}
              className={`w-full`}
            >
              {productsList}
            </motion.ul>
          </Card>
        </section>
    )
};

export default AvailableProducts;

export async function loader () {
  try {
    const response = await axios.get(`${apiUrl}/api/productss`);
    return response.data.rows;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw json( { isNextLine: false, button, message: 'Failed to fetch products.' }, {
      status: 500
    } )
  }
}