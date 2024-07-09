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
        name,
        description,
        price
    }

    console.log('product',product,'id',productId);

    return (
        <div>
            <Detail product={product} />    
        </div>
    )
}

export default DetailPage;