import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', age: '', contactNumber: '', password: ''
    });
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const navigate = useNavigate();

    // Load reCAPTCHA script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.grecaptcha = window.grecaptcha || {};
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get reCAPTCHA token
        if (window.grecaptcha && window.grecaptcha.execute) {
            try {
                const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
                const token = await window.grecaptcha.execute(siteKey, { action: 'register' });
                setRecaptchaToken(token);

                // Submit with token
                const res = await axios.post('http://localhost:5000/api/auth/register', {
                    ...formData,
                    recaptchaToken: token
                });
                alert(res.data.msg);
                navigate('/login');
            } catch (err) {
                alert(err.response?.data?.msg || 'Registration failed');
            }
        } else {
            // Fallback without reCAPTCHA
            try {
                const res = await axios.post('http://localhost:5000/api/auth/register', {
                    ...formData,
                    recaptchaToken: ''
                });
                alert(res.data.msg);
                navigate('/login');
            } catch (err) {
                alert(err.response?.data?.msg || 'Registration failed');
            }
        }
    };

    const inputStyle = {
        padding: '14px 16px',
        borderRadius: '10px',
        border: '2px solid #e0e0e0',
        fontSize: '14px',
        transition: 'all 0.3s',
        outline: 'none',
        backgroundColor: '#f8f9fa'
    };

    const handleInputFocus = (e) => {
        e.target.style.borderColor = '#667eea';
        e.target.style.backgroundColor = '#fff';
        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = '#e0e0e0';
        e.target.style.backgroundColor = '#f8f9fa';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '40px',
            paddingBottom: '40px'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '45px 40px',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h1 style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 10px 0'
                    }}>
                        MergeMarket
                    </h1>
                    <p style={{ color: '#888', margin: '0', fontSize: '14px', fontWeight: '500' }}>Join the community</p>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '24px' }}>Create Account</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input 
                        type="text" 
                        placeholder="👤 First Name"
                        value={formData.firstName} 
                        onChange={e => setFormData({...formData, firstName: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <input 
                        type="text" 
                        placeholder="👤 Last Name"
                        value={formData.lastName} 
                        onChange={e => setFormData({...formData, lastName: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <input 
                        type="email" 
                        placeholder="📧 IIIT Email (iiit.ac.in)"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <input 
                        type="number" 
                        placeholder="🎂 Age"
                        value={formData.age} 
                        onChange={e => setFormData({...formData, age: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <input 
                        type="text" 
                        placeholder="☎️ Contact Number"
                        value={formData.contactNumber} 
                        onChange={e => setFormData({...formData, contactNumber: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <input 
                        type="password" 
                        placeholder="🔐 Password"
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        required 
                        style={inputStyle}
                        onFocus={(e) => handleInputFocus(e)}
                        onBlur={(e) => handleInputBlur(e)}
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '14px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginTop: '10px',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        Create Account
                    </button>
                    <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', margin: '10px 0 0 0' }}>
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>Privacy Policy</a> and <a href="https://policies.google.com/terms" style={{ color: '#667eea', textDecoration: 'none' }}>Terms of Service</a> apply.
                    </p>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '14px' }}>
                    Already have an account? <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;