import { useLoaderData, json } from "react-router-dom";
import Detail from "../components/Detail/Detail";
import { useContext, useEffect } from "react";
import CartContext from "../store/cart-context";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function DetailPage() {
    const data = useLoaderData();
    console.log(data)

    const cartCTX = useContext(CartContext);

    useEffect(() => {
        if (data && data.length > 0) {
          cartCTX.setCart({
            items: data.carts,
            totalAmount: +data.carts[data.carts.length - 1].totalAmount
          });
        } else {
          // Handle the case where data is empty
          cartCTX.setCart({
            items: [],
            totalAmount: 0
          });
        }
    }, [data]);

    return (
        <Detail product={data.product} />
    )
}

export default DetailPage;

export async function detailLoader({ request, params }) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || '';
    const name = url.searchParams.get('name') || '';
    const description = url.searchParams.get('description') || '';
    const price = url.searchParams.get('price') || '';
    const amount = url.searchParams.get('amount') || '';

    const product = {
        id,
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        price,
        amount: decodeURIComponent(amount)
    };

    try {
        const usersResponse = await axios.get(`${apiUrl}/api/users`);
        const users = usersResponse.data.rows;

        if (!users || users.length === 0) {
            throw new Error('No users found');
        }

        const userId = users[users.length - 1].id;

        const productsResponse = await axios.get(`${apiUrl}/api/cart-products`, {
            params: { userId }
        });

        return { product, productId: params.productId, carts: productsResponse.data.rows };
    } catch (error) {
        console.error('Failed to fetch cart products:', error.message);

        if (product.id) {
            return { product, productId: params.productId, carts: [] };
        } else {
            throw json({ isNextLine: true, message: 'Failed to fetch cart products.' }, {
                status: 500
            });
        }
    }
}   