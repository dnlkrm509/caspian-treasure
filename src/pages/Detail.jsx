import { useParams } from "react-router-dom";
import Detail from "../components/Detail/Detail";

function DetailPage() {
    const { product } = useParams();
    console.log(product);

    return (
        <div>
            <Detail product={product} />    
        </div>
    )
}

export default DetailPage;