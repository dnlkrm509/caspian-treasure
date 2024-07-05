import React from 'react';
import AvailableProducts from './AvailableProducts';
import ProductsSummary from './ProductsSummary';

const Products = () => {
    return (
        <React.Fragment>
            <ProductsSummary/>
            <AvailableProducts/>
        </React.Fragment>
    )
};

export default Products;