import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = () => {
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem('token');

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize chat session on component mount
    useEffect(() => {
        const initChat = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/chat/start', {}, {
                    headers: { 'x-auth-token': token }
                });
                setSessionId(res.data.sessionId);
                setMessages([{
                    role: 'assistant',
                    content: 'Hi! 👋 Welcome to IIITH Buy-Sell Support. How can I help you today?'
                }]);
            } catch (err) {
                console.error('Failed to start chat session', err);
            } finally {
                setIsInitializing(false);
            }
        };

        initChat();
    }, [token]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !sessionId) return;

        const userMessage = inputValue;
        setInputValue('');

        // Add user message to UI immediately
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await axios.post(
                'http://localhost:5000/api/chat/message',
                { sessionId, message: userMessage },
                { headers: { 'x-auth-token': token } }
            );

            setMessages((prev) => [...prev, { role: 'assistant', content: res.data.message }]);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Sorry, something went wrong. Please try again.';
            setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitializing) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
                <p>Loading chat...</p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                padding: '0',
                background: '#f5f5f5'
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '16px',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <h2 style={{ margin: 0 }}>IIITH Buy-Sell Support 💬</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                    We're here to help!
                </p>
            </div>

            {/* Messages Container */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: msg.role === 'user' ? '#007bff' : '#e9ecef',
                                color: msg.role === 'user' ? 'white' : '#333',
                                wordWrap: 'break-word',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: '#e9ecef',
                                color: '#666'
                            }}
                        >
                            <span>Thinking</span>
                            <span style={{ animation: 'dots 1.5s infinite' }}>...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
                style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    gap: '8px'
                }}
            >
                <form
                    onSubmit={sendMessage}
                    style={{
                        display: 'flex',
                        gap: '8px',
                        width: '100%'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: isLoading || !inputValue.trim() ? 0.6 : 1
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes dots {
                    0%, 20% {
                        content: '.';
                    }
                    40% {
                        content: '..';
                    }
                    60%, 100% {
                        content: '...';
                    }
                }
            `}</style>
        </div>
    );
};

export default Chat;
