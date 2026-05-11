import { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [formData, setFormData] = useState({
        name: '', price: '', description: '', category: 'clothing' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve saved token [cite: 40]
        
        try {
            await axios.post('http://localhost:5000/api/items/add', formData, {
                headers: { 'x-auth-token': token } // Send token for authorization 
            });
            alert('Item listed successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    const controlStyle = { padding: '10px', borderRadius: '8px' };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input style={controlStyle} type="text" placeholder="Item Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input style={controlStyle} type="number" placeholder="Price" onChange={e => setFormData({...formData, price: e.target.value})} required />
            <textarea style={{ ...controlStyle, minHeight: '80px' }} placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} required />
            <select style={controlStyle} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="clothing">Clothing</option>
                <option value="grocery">Grocery</option>
                <option value="electronics">Electronics</option>
            </select>
            <button type="submit" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none' }}>List Item</button>
        </form>
    );
};