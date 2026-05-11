import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useSearchParams } from 'react-router-dom';

const CASCallback = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCASCallback = async () => {
            try {
                const ticket = searchParams.get('ticket');

                if (!ticket) {
                    setError('No CAS ticket received. Please try again.');
                    setIsLoading(false);
                    return;
                }

                // Send ticket to backend for verification
                const res = await axios.post(`${API_BASE_URL}/api/auth/cas-login`, {
                    ticket: ticket
                });

                // Store token and user data
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                // Redirect to home
                window.location.href = '/search';
            } catch (err) {
                console.error('CAS callback error:', err);
                setError(err.response?.data?.msg || 'CAS login failed. Please try again.');
                setIsLoading(false);
            }
        };

        handleCASCallback();
    }, [searchParams]);

    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Authenticating with IIIT CAS...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <p>{error}</p>
                <a href="/login">Back to Login</a>
            </div>
        );
    }

    return <div>Redirecting...</div>;
};

export default CASCallback;
