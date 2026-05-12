import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.location.href = '/search'; // Force refresh to update Navbar
        } catch (err) {
            alert(err.response?.data?.msg || "Login failed");
        }
    };

    const handleCASLogin = () => {
        const serviceUrl = encodeURIComponent(`${window.location.origin}/auth/cas-callback`);
        const casLoginUrl = `https://login.iiit.ac.in/cas/login?service=${serviceUrl}`;
        window.location.href = casLoginUrl;
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
                maxWidth: '450px',
                width: '100%',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '50px 40px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h1 style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 10px 0',
                        lineHeight: '1.25',
                        paddingBottom: '4px',
                        display: 'inline-block'
                    }}>
                        MergeMarket
                    </h1>
                    <p style={{ color: '#888', margin: '0', fontSize: '14px', fontWeight: '500' }}>IIIT Hyderabad Marketplace</p>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '24px' }}>Welcome Back</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="📧 Email Address"
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required
                        style={{
                            padding: '14px 16px',
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            fontSize: '14px',
                            transition: 'all 0.3s',
                            outline: 'none',
                            backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <input 
                        type="password" 
                        placeholder="🔐 Password"
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required
                        style={{
                            padding: '14px 16px',
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            fontSize: '14px',
                            transition: 'all 0.3s',
                            outline: 'none',
                            backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.boxShadow = 'none';
                        }}
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
                        Login
                    </button>
                </form>

                <div style={{ margin: '30px 0', textAlign: 'center', position: 'relative' }}>
                    <div style={{ borderTop: '1px solid #e0e0e0', marginBottom: '20px' }} />
                    <p style={{ color: '#888', fontSize: '13px', margin: '0' }}>Or continue with IIIT</p>
                </div>

                <button
                    type="button"
                    onClick={handleCASLogin}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
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
                    }}
                >
                    🎓 Login with CAS
                </button>

                <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '14px' }}>
                    New user? <a href="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Create account</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
