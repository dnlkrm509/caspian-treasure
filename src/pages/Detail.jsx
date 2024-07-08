import { useParams } from "react-router-dom";

function DetailPage() {
    const { productId } = useParams();

    return (
        <div>
            <h2>Product Detail Page</h2>
            <p>{productId}</p>
        </div>
    )
}

export default DetailPage;