import { useParams, useLocation } from "react-router-dom";
import Detail from "../components/Detail/Detail";

function DetailPage() {
    const { productId } = useParams();
    const query = URLSearchParams(useLocation.search);
    const product = query.get('product');

    console.log('product',product,'id',productId);

    return (
        <div>
            <Detail product={product} />    
        </div>
    )
}

export default DetailPage;