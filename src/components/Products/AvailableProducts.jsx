import Card from '../UI/Card/Card';
import classes from './AvailableProducts.module.css';
import ProductItem from './ProductItem/ProductItem';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../UI/LoadingSpinner/LoadingSpinner';
import Error from '../UI/Error';
import axios from 'axios';

const AvailableProducts = () => {
    const [products, setProducts] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
      async function fetchAllProducts () {
        setIsFetching(true);
        
        try {
          const response = await axios.get('/api/products');
          setProducts(response.data.rows);
        } catch (error) {
          setError('Could not fetch products.' );
          console.error('Error fetching data:', error)
        }

          setIsFetching(false)  
      }

      fetchAllProducts();
    }, [])
    
    let productsList = <li><Error title='No Products found.' isNextLine={false} /></li>;

    const btnClasses = error ? classes['try-again'] : '';

    if (isFetching) {
      productsList = <LoadingSpinner />
    };

    if (error) {
      productsList = <li className={btnClasses}>
        <Error body={error} isNextLine={false} button /></li>;
    };

    if (products.length > 0) {
      productsList = products.map((product) => (
        <ProductItem
          id={product.id} 
          key={product.id} 
          name={product.name} 
          description={product.description}
          price={+product.price}
        />
      ))
    };

    const ulClasses = isFetching ? classes.isLoading : '';

    return (
        
        <section className={classes.products}>
          <Card>
            <motion.ul
              initial={{ opacity: 0, y: '3rem'}}
              animate={{opacity: 1, y: 0}}
              className={`w-full ${ulClasses}`}
            >
              {productsList}
            </motion.ul>
          </Card>
        </section>
    )
};

export default AvailableProducts;
