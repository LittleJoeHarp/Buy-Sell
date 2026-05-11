import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const DeliverItems = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [otp, setOtp] = useState({});
    const token = localStorage.getItem('token');

    const fetchDeliveries = async () => {
        const res = await axios.get(`${API_BASE_URL}/api/orders/received`, {
            headers: { 'x-auth-token': token }
        });
        setDeliveries(res.data);
    };

    useEffect(() => { fetchDeliveries(); }, []);

    const verify = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/api/orders/verify-otp`, { orderId: id, otpInput: otp[id] }, {
                headers: { 'x-auth-token': token }
            });
            alert("Transaction Closed!");
            fetchDeliveries();
        } catch (err) { alert("Invalid OTP"); }
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>Items to Deliver</h2>
            {deliveries.length === 0 ? (
                <p>No pending deliveries</p>
            ) : (
                deliveries.map(d => (
                    <div key={d._id} style={{ border: '1px solid #444', padding: '15px', margin: '10px 0' }}>
                        <h3>{d.itemName}</h3>
                        <p><strong>Price:</strong> ₹{d.amount}</p>
                        <p><strong>Buyer:</strong> {d.buyerId.firstName} {d.buyerId.lastName}</p>
                        <p><strong>Buyer Email:</strong> {d.buyerId.email}</p>
                        <div style={{ marginTop: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Enter OTP from buyer" 
                                value={otp[d._id] || ''}
                                onChange={(e) => setOtp({...otp, [d._id]: e.target.value})} 
                                style={{ padding: '5px', marginRight: '10px' }}
                            />
                            <button onClick={() => verify(d._id)} style={{ padding: '5px 15px', cursor: 'pointer' }}>
                                Verify & Close
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default DeliverItems;