import { useLoaderData, json } from "react-router-dom";
import Detail from "../components/Detail/Detail";
import { useContext, useEffect } from "react";
import CartContext from "../store/cart-context";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const data = useLoaderData();

    const cartCTX = useContext(CartContext);

    useEffect(() => {
        if (data.carts && data.carts.length > 0) {
            cartCTX.setCart({
                items: data.carts,
                totalAmount: +data.carts[data.carts.length - 1].totalAmount,
            });
        }
    }, []);

    return (
        <Detail product={data.product} />
    )
}

export default DetailPage;

export async function detailLoader({ request, params }) {
    const url = new URL(request.url);
    const query = url.searchParams;

    const id = query.get('id') || '';
    const name = query.get('name') || '';
    const description = query.get('description') || '';
    const price = query.get('price') || '';
    const amount = query.get('amount') || '';

    const product = {
        id,
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        price,
        amount: decodeURIComponent(amount)
    }

    try {
        const products = await axios.get(`${apiUrl}/api/cart-products`);
        return { product, productId: params.productId, carts: products.data.rows };

    } catch (error) {
        console.error('Failed to fetch cart products:', error.message);

        if (product.id) {
            return { product, productId: params.productId, carts: [] };
        } else {
            throw json( { isNextLine: true, message: 'Failed to fetch cart products.' }, {
                status: 500
              } )
        }
    }
}   