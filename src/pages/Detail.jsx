import { useParams, useLocation, useLoaderData } from "react-router-dom";
import Detail from "../components/Detail/Detail";
import { useContext, useEffect, useState } from "react";
import CartContext from "../store/cart-context";
import axios from "axios";
import LoadingSpinner from "../components/UI/LoadingSpinner/LoadingSpinner";
import Error from '../components/UI/Error';

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const data = useLoaderData();
    console.log(data)
    const { productId } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');
    const name = query.get('name');
    const description = query.get('description');
    const price = query.get('price');
    const amount = query .get('amount');

    const product = {
        id,
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        price,
        amount: decodeURIComponent(amount)
    }

    const cartCTX = useContext(CartContext);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        async function fetchCartProduct() {
            setIsFetching(true);

            try {
                const products = await axios.get(`${apiUrl}/api/cart-products`);
                
                cartCTX.setCart({ items: products.data.rows, totalAmount: +products.data.rows[ products.data.rows.length -1 ].totalAmount });
            } catch (error) {
                if (product.id) {
                    setError();
                } else {
                    setError({ message: "Failed to fetch cart products." });
                }
            }

            setIsFetching(false);
        }

          fetchCartProduct();
    }, []);

    return (
        <div>
            {isFetching && <LoadingSpinner />}
            {error && <Error title='An Error occurred!' body={error.message} />}
            {!isFetching && !error && (
                <Detail product={product} productId={productId} />)}
        </div>
    )
}

export default DetailPage;

export async function detailLoader({ request, params }) {
    //const id = params.productId;
    
    return request
    // try {
    //     const response = await axios.get(`${apiUrl}/api/products/products/${id}?id=${request.id}&name=${decodeURIComponent(request.name)}&description=${decodeURIComponent(request.description)}&price=${request.price}&amount=${decodeURIComponent(request.amount)}`);
    //     return response.data.rows;
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //     throw json( { isNextLine: false, message: 'Failed to fetch details for selected product.' }, {
    //       status: 500
    //     } )
    // }
}