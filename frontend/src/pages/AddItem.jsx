import { useEffect, useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [item, setItem] = useState({ name: '', price: '', description: '', category: 'other', quantity: 1 });
    const [myListings, setMyListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', price: '', description: '', category: 'other', quantity: 0 });

    const fetchMyListings = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/items/my-listings', {
            headers: { 'x-auth-token': token }
        });
        setMyListings(res.data);
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/items/add', {
                name: item.name,
                price: Number(item.price),
                description: item.description,
                category: item.category,
                quantity: Number(item.quantity)
            }, {
                headers: { 'x-auth-token': token }
            });
            alert('Item listed successfully!');
            setItem({ name: '', price: '', description: '', category: 'other', quantity: 1 });
            fetchMyListings();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error listing item');
        }
    };

    const startEdit = (listing) => {
        setEditingId(listing._id);
        setEditForm({
            name: listing.name,
            price: listing.price,
            description: listing.description,
            category: listing.category,
            quantity: listing.quantity
        });
    };

    const saveEdit = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `http://localhost:5000/api/items/${id}`,
                {
                    name: editForm.name,
                    price: Number(editForm.price),
                    description: editForm.description,
                    category: editForm.category,
                    quantity: Number(editForm.quantity)
                },
                { headers: { 'x-auth-token': token } }
            );
            alert('Product updated');
            setEditingId(null);
            fetchMyListings();
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to update product');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', price: '', description: '', category: 'other', quantity: 0 });
    };

    const deleteListing = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`, {
                headers: { 'x-auth-token': token }
            });
            alert('Listing deleted');
            fetchMyListings();
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete listing');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>List a New Item</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px' }}>
                <input type="text" placeholder="Item Name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required />
                <input type="number" placeholder="Price" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} required />
                <textarea placeholder="Description" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} required />
                <select value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value })}>
                    <option value="other">Other</option>
                    <option value="clothing">Clothing</option>
                    <option value="electronics">Electronics</option>
                    <option value="grocery">Grocery</option>
                </select>
                <input
                    type="number"
                    min="1"
                    placeholder="Number of units available"
                    value={item.quantity}
                    onChange={(e) => setItem({ ...item, quantity: e.target.value })}
                    required
                />
                <button type="submit">List Item</button>
            </form>

            <h3 style={{ marginTop: '30px' }}>My Listings</h3>
            {myListings.length === 0 ? (
                <p>You have not listed any items yet.</p>
            ) : (
                myListings.map((listing) => (
                    <div key={listing._id} style={{ border: '1px solid #ccc', marginTop: '10px', padding: '12px' }}>
                        {editingId === listing._id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px' }}>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                />
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                                <select
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                >
                                    <option value="other">Other</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="grocery">Grocery</option>
                                </select>
                                <input
                                    type="number"
                                    min="0"
                                    value={editForm.quantity}
                                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button type="button" onClick={() => saveEdit(listing._id)}>Save</button>
                                    <button type="button" onClick={cancelEdit}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p><strong>{listing.name}</strong> - ₹{listing.price}</p>
                                <p>{listing.description}</p>
                                <p>Category: {listing.category}</p>
                                <p>Quantity: {listing.quantity}</p>
                                <p>Status: {listing.status === 'out_of_stock' ? 'Out of Stock' : 'Available'}</p>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button type="button" onClick={() => startEdit(listing)}>Edit Product</button>
                                    <button type="button" onClick={() => deleteListing(listing._id)} style={{ background: '#a33', color: '#fff' }}>
                                        Delete Product
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AddItem;