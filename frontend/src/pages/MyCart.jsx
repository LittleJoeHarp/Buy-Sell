import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/users/cart`, {
                headers: { 'x-auth-token': token }
            });
            setCartItems(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCart(); }, []);

    const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/cart/${itemId}`, {
                headers: { 'x-auth-token': token }
            });
            fetchCart(); // Refresh cart
        } catch (err) { alert("Failed to remove item"); }
    };

    const handleCheckout = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/orders/checkout`, {}, {
                headers: { 'x-auth-token': token }
            });
            alert("Order Successful! Check 'Orders History' for your OTPs.");
            setCartItems([]); // Clear UI
            fetchCart(); // Refresh after checkout
        } catch (err) { alert("Checkout failed"); }
    };

    return (
        <div style={{ padding: '30px 20px', backgroundColor: '#f5f7fa', minHeight: '90vh' }}>
            <h1 style={{ color: '#333', marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>🛒 Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ fontSize: '48px', margin: '0 0 15px 0' }}>🛍️</p>
                    <p style={{ color: '#888', fontSize: '18px', margin: '0' }}>Your cart is empty. Start shopping!</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                        {cartItems.map(item => (
                            <div key={item._id} style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s',
                                border: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#667eea';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                            }}>
                                <div>
                                    <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700' }}>
                                        {item.name}
                                    </h3>
                                    <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '14px' }}>
                                        Seller: <strong>{item.sellerId?.firstName} {item.sellerId?.lastName}</strong>
                                    </p>
                                    <p style={{ color: '#667eea', margin: '0', fontSize: '16px', fontWeight: '700' }}>
                                        ₹{item.price}
                                    </p>
                                </div>
                                <button onClick={() => removeItem(item._id)} style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#c82333';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#dc3545';
                                    e.target.style.transform = 'scale(1)';
                                }}>
                                    🗑️ Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '25px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e0e0e0', paddingBottom: '15px', marginBottom: '15px' }}>
                            <span style={{ color: '#666', fontSize: '16px', fontWeight: '600' }}>Subtotal:</span>
                            <span style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>₹{totalCost}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' }}>
                            <span style={{ color: '#666', fontSize: '16px', fontWeight: '600' }}>Shipping:</span>
                            <span style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e0e0e0', paddingTop: '15px' }}>
                            <span style={{ color: '#333', fontSize: '20px', fontWeight: '700' }}>Total:</span>
                            <span style={{
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                padding: '8px 16px',
                                borderRadius: '8px'
                            }}>
                                ₹{totalCost}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleCheckout} style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '700',
                        transition: 'all 0.3s',
                        boxShadow: '0 10px 25px rgba(40, 167, 69, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 15px 35px rgba(40, 167, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 25px rgba(40, 167, 69, 0.3)';
                    }}>
                        ✅ Proceed to Checkout
                    </button>
                </>
            )}
        </div>
    );
};

export default MyCart;