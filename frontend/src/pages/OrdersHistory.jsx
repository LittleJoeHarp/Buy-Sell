import { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersHistory = () => {
    const [orders, setOrders] = useState({ pending: [], bought: [], sold: [] });
    const [tab, setTab] = useState('pending');
    const [reviewDraft, setReviewDraft] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                setError('');
                const res = await axios.get('http://localhost:5000/api/orders/history', {
                    headers: { 'x-auth-token': token }
                });
                setOrders(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to load order history');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    const cancelOrder = async (orderId) => {
        try {
            await axios.post(`http://localhost:5000/api/orders/cancel/${orderId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            alert('Order cancelled successfully');
            // Refresh history
            const res = await axios.get('http://localhost:5000/api/orders/history', {
                headers: { 'x-auth-token': token }
            });
            setOrders(res.data);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to cancel order');
        }
    };

    const submitReview = async (order) => {
        const draft = reviewDraft[order._id] || {};

        try {
            await axios.post(`http://localhost:5000/api/users/reviews/${order.sellerId?._id}`, {
                rating: Number(draft.rating),
                comment: draft.comment || ''
            }, {
                headers: { 'x-auth-token': token }
            });
            alert('Review submitted successfully');
            setReviewDraft((prev) => ({ ...prev, [order._id]: { rating: '', comment: '' } }));
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to submit review');
        }
    };

    const formatDate = (value) => {
        if (!value) return 'Unknown time';
        return new Date(value).toLocaleString();
    };

    const tabLabel = {
        pending: 'Pending Orders',
        bought: 'Bought Items',
        sold: 'Sold Items'
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>Order History</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => setTab('pending')}>
                    Pending ({orders.pending.length})
                </button>
                <button onClick={() => setTab('bought')}>
                    Bought ({orders.bought.length})
                </button>
                <button onClick={() => setTab('sold')}>
                    Sold ({orders.sold.length})
                </button>
            </div>

            <h3 style={{ marginBottom: '12px' }}>{tabLabel[tab]}</h3>

            {isLoading && <p>Loading history...</p>}
            {error && <p style={{ color: '#ff7f7f' }}>{error}</p>}

            {!isLoading && !error && orders[tab].length === 0 && (
                <p>No orders in this tab yet.</p>
            )}

            {!isLoading && !error && orders[tab].map((o) => (
                <div
                    key={o._id}
                    style={{
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '14px',
                        margin: '12px 0',
                        background: '#101010'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0 }}>{o.itemName || 'Item'}</h4>
                        <span style={{ border: '1px solid #666', borderRadius: '999px', padding: '2px 10px' }}>
                            {o.status?.toUpperCase()}
                        </span>
                    </div>

                    <p><strong>Transaction ID:</strong> {o.transactionId}</p>
                    <p><strong>Amount:</strong> ₹{o.amount}</p>
                    <p><strong>Placed On:</strong> {formatDate(o.createdAt)}</p>

                    {tab !== 'sold' && (
                        <p>
                            <strong>Seller:</strong> {o.sellerId?.firstName} {o.sellerId?.lastName}
                        </p>
                    )}

                    {tab === 'sold' && (
                        <p>
                            <strong>Buyer:</strong> {o.buyerId?.firstName} {o.buyerId?.lastName}
                        </p>
                    )}

                    {tab === 'pending' && (
                        <p style={{ color: '#4da6ff' }}>
                            <strong>Your OTP:</strong> {o.plainOtp}
                        </p>
                    )}

                    {tab === 'pending' && (
                        <div style={{ marginTop: '12px' }}>
                            <button onClick={() => cancelOrder(o._id)} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel Order
                            </button>
                        </div>
                    )}

                    {tab === 'bought' && (
                        <div style={{ marginTop: '10px' }}>
                            <p style={{ marginBottom: '8px' }}><strong>Leave a review for this seller</strong></p>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                placeholder="Rating (1-5)"
                                value={reviewDraft[o._id]?.rating || ''}
                                onChange={(e) => setReviewDraft((prev) => ({
                                    ...prev,
                                    [o._id]: { ...prev[o._id], rating: e.target.value }
                                }))}
                                style={{ marginRight: '8px' }}
                            />
                            <input
                                type="text"
                                placeholder="Comment"
                                value={reviewDraft[o._id]?.comment || ''}
                                onChange={(e) => setReviewDraft((prev) => ({
                                    ...prev,
                                    [o._id]: { ...prev[o._id], comment: e.target.value }
                                }))}
                                style={{ marginRight: '8px' }}
                            />
                            <button onClick={() => submitReview(o)}>Submit Review</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OrdersHistory;