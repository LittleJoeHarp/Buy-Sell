const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API (use environment variable or free API key)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store chat sessions in memory (for production, use database)
const chatSessions = {};

// --- START NEW CHAT SESSION ---
router.post('/start', auth, async (req, res) => {
    try {
        const sessionId = `session_${req.user.id}_${Date.now()}`;
        chatSessions[sessionId] = {
            userId: req.user.id,
            history: [],
            createdAt: new Date()
        };
        res.json({ sessionId, msg: 'Chat session started' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- SEND MESSAGE AND GET RESPONSE ---
router.post('/message', auth, async (req, res) => {
    const { sessionId, message } = req.body;

    try {
        if (!sessionId || !message) {
            return res.status(400).json({ msg: 'sessionId and message are required' });
        }

        const session = chatSessions[sessionId];
        if (!session) {
            return res.status(404).json({ msg: 'Chat session not found' });
        }

        if (session.userId !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to access this session' });
        }

        // Add user message to history
        session.history.push({
            role: 'user',
            content: message
        });

        // Build conversation history for Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Create prompt with context about the Buy-Sell platform
        const systemContext = `You are a helpful support chatbot for IIITH Buy-Sell, a peer-to-peer marketplace at IIIT Hyderabad. 
Students use this platform to buy and sell items within the campus community.
Be friendly, helpful, and provide accurate information about the platform.
Keep responses concise and relevant to the user's query.`;

        const conversationText = session.history
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        const prompt = `${systemContext}\n\nConversation:\n${conversationText}`;

        const result = await model.generateContent(prompt);
        const botResponse = result.response.text();

        // Add bot response to history
        session.history.push({
            role: 'assistant',
            content: botResponse
        });

        res.json({
            sessionId,
            message: botResponse,
            history: session.history
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Failed to get response from chatbot' });
    }
});

// --- GET CHAT HISTORY ---
router.get('/history/:sessionId', auth, async (req, res) => {
    try {
        const session = chatSessions[req.params.sessionId];
        if (!session) {
            return res.status(404).json({ msg: 'Chat session not found' });
        }

        if (session.userId !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to access this session' });
        }

        res.json({ history: session.history });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
