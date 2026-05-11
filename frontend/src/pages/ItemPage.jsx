import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ItemPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            const res = await axios.get(`http://localhost:5000/api/items/${id}`);
            setItem(res.data);
        };
        fetchItem();
    }, [id]);

    const addToCart = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/users/cart/add/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            alert("Added to cart!"); 
        } catch (err) { alert(err.response.data.msg); }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{item.name}</h1> 
            <p><strong>Price:</strong> ₹{item.price}</p> 
            <p><strong>Description:</strong> {item.description}</p> 
            <p><strong>Vendor:</strong> {item.sellerId.firstName} {item.sellerId.lastName}</p> 
            <p>
                    <strong>Remaining:</strong> {Math.max(0, (item.quantity || 0) - (item.reserved || 0))}
            </p>
                <button onClick={addToCart} disabled={((item.quantity || 0) - (item.reserved || 0)) <= 0}>Add to Cart</button>
        </div>
    );
};
export default ItemPage;