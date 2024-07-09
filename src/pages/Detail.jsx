import { useParams, useLocation } from "react-router-dom";
import Detail from "../components/Detail/Detail";

function DetailPage() {
    const { productId } = useParams();
    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');
    const name = query.get('name');
    const description = query.get('description');
    const price = query.get('price');

    const product = {
        id,
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        price
    }

    return (
        <div>
            <Detail product={product} productID={productId} />
        </div>
    )
}

export default DetailPage;