import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categoriesList = ['clothing', 'grocery', 'electronics', 'other'];

    const fetchItems = async () => {
        const token = localStorage.getItem('token');
        const catQuery = selectedCategories.join(',');
        
        // Fetch items based on search and selected filters [cite: 61]
        const res = await axios.get(`http://localhost:5000/api/items?search=${search}&categories=${catQuery}`, {
            headers: { 'x-auth-token': token }
        });
        setItems(res.data);
    };

    useEffect(() => { fetchItems(); }, [search, selectedCategories]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    return (
        <div style={{ padding: '30px 20px', backgroundColor: '#f5f7fa', minHeight: '90vh' }}>
            <h1 style={{ color: '#333', marginBottom: '30px', fontSize: '32px', fontWeight: '700' }}>🔍 Explore Items</h1>
            
            {/* Search Bar  */}
            <input 
                type="text" 
                placeholder="🔎 Search for items..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    marginBottom: '25px',
                    transition: 'all 0.3s',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.2)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
            />

            {/* Category Filters  */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-block', color: '#666', fontWeight: '600', marginRight: '10px' }}>📂 Categories:</span>
                {categoriesList.map(cat => (
                    <label key={cat} style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 14px',
                        backgroundColor: selectedCategories.includes(cat) ? '#667eea' : 'white',
                        color: selectedCategories.includes(cat) ? 'white' : '#333',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        border: '2px solid',
                        borderColor: selectedCategories.includes(cat) ? '#667eea' : '#e0e0e0',
                        transition: 'all 0.3s',
                        boxShadow: selectedCategories.includes(cat) ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                    }}>
                        <input type="checkbox" onChange={() => toggleCategory(cat)} style={{ marginRight: '6px', cursor: 'pointer' }} /> {cat}
                    </label>
                ))}
            </div>

            {/* Results Display  */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {items.map(item => (
                    <div key={item._id} style={{ 
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        transform: 'translateY(0)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }}>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ color: '#333', fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
                                {item.name}
                            </h3>
                            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 15px 0' }}>
                                By <strong>{item.sellerId?.firstName} {item.sellerId?.lastName}</strong>
                            </p>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ color: '#667eea', fontSize: '20px', fontWeight: '700', margin: '0' }}>
                                    ₹{item.price}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                                {
                                    (() => {
                                        const remaining = (item.quantity || 0) - (item.reserved || 0);
                                        const isOut = remaining <= 0;
                                        return (
                                            <span style={{ 
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: isOut ? '#ffe8e8' : '#e8f5e9',
                                                color: isOut ? '#d9534f' : '#28a745'
                                            }}>
                                                {isOut ? '❌ Out of Stock' : `✅ ${remaining} Available`}
                                            </span>
                                        );
                                    })()
                                }
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    backgroundColor: '#e3f2fd',
                                    color: '#667eea'
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            <Link to={`/item/${item._id}`} style={{
                                display: 'block',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: '600',
                                transition: 'all 0.3s',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#764ba2';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#667eea';
                            }}
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                    <p style={{ fontSize: '18px' }}>No items found. Try a different search! 🔍</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;