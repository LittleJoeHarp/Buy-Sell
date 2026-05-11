import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState({ firstName: '', lastName: '', age: '', contactNumber: '', email: '', sellerReviews: [] });
    const [originalUser, setOriginalUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'x-auth-token': token }
        });
        setUser(res.data);
        setOriginalUser(res.data);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Check if anything actually changed
        if (!originalUser) {
            alert("Profile data not loaded yet.");
            return;
        }

        const changed = 
            user.firstName !== originalUser.firstName || 
            user.lastName !== originalUser.lastName ||
            Number(user.age) !== Number(originalUser.age) ||
            user.contactNumber !== originalUser.contactNumber;

        if (!changed) {
            alert("No changes made.");
            setIsEditing(false);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/users/profile', 
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: Number(user.age),
                    contactNumber: user.contactNumber
                },
                {
                    headers: { 'x-auth-token': token }
                }
            );
            setIsEditing(false);
            setOriginalUser(user);
            alert("Profile Updated!");
        } catch (err) { 
            alert(err.response?.data?.msg || "Update failed");
            console.error(err); 
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/users/reviews/${reviewId}`, {
                headers: { 'x-auth-token': token }
            });
            await fetchProfile();
            alert('Review deleted');
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete review');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Profile</h2>
            <p><strong>Email:</strong> {user.email} (Non-editable)</p> 
            
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>First Name: </label>
                          <input type="text" value={user.firstName} disabled={!isEditing} 
                              onChange={(e) => setUser({...user, firstName: e.target.value})}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isEditing ? '2px solid #007bff' : '1px solid #ccc', backgroundColor: isEditing ? '#fff' : '#f3f6fa', color: '#000', cursor: isEditing ? 'text' : 'default' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Last Name: </label>
                          <input type="text" value={user.lastName} disabled={!isEditing} 
                              onChange={(e) => setUser({...user, lastName: e.target.value})}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isEditing ? '2px solid #007bff' : '1px solid #ccc', backgroundColor: isEditing ? '#fff' : '#f3f6fa', color: '#000', cursor: isEditing ? 'text' : 'default' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Age: </label>
                          <input type="number" value={user.age} disabled={!isEditing} 
                              onChange={(e) => setUser({...user, age: e.target.value})}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isEditing ? '2px solid #007bff' : '1px solid #ccc', backgroundColor: isEditing ? '#fff' : '#f3f6fa', color: '#000', cursor: isEditing ? 'text' : 'default' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Contact: </label>
                          <input type="text" value={user.contactNumber} disabled={!isEditing} 
                              onChange={(e) => setUser({...user, contactNumber: e.target.value})}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isEditing ? '2px solid #007bff' : '1px solid #ccc', backgroundColor: isEditing ? '#fff' : '#f3f6fa', color: '#000', cursor: isEditing ? 'text' : 'default' }} />
                </div>

                {isEditing ? (
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" style={{ marginRight: '10px', backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>
                            Save Changes
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setIsEditing(false);
                                setUser(originalUser);
                            }}
                            style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 16px', border: 'none', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Edit Profile
                    </button>
                )}
            </form>

            <div style={{ marginTop: '24px' }}>
                <h3>Seller Reviews</h3>
                {user.sellerReviews && user.sellerReviews.length > 0 ? (
                    user.sellerReviews.map((review) => (
                        <div key={review._id} style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                            <p><strong>Reviewer:</strong> {review.reviewerName}</p>
                            <p><strong>Rating:</strong> {review.rating}/5</p>
                            <p><strong>Comment:</strong> {review.comment || 'No comment'}</p>
                            <button
                                type="button"
                                onClick={() => handleDeleteReview(review._id)}
                                style={{ marginTop: '8px', padding: '6px 10px', cursor: 'pointer' }}
                            >
                                Delete Review
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};
export default Profile;