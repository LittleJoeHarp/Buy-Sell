const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(express.json()); 
app.use(cors({
    origin: [
        "https://buy-sell-sigma.vercel.app", // Your actual Vercel URL
        "http://localhost:5173"
    ],
    credentials: true
}));

// 2. MongoDB Connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 3. ROUTES
app.get('/', (req, res) => {
  res.send('Buy-Sell @ IIITH Server is Running');
});

// Auth (Login/Register)
app.use('/api/auth', require('./routes/auth'));

// Items (Listing/Search)
app.use('/api/items', require('./routes/items')); 

// Users (Profile/Cart)
app.use('/api/users', require('./routes/users'));

// --- THIS WAS MISSING ---
// Orders (OTP/History/Verification)
app.use('/api/orders', require('./routes/orders')); 

// Chat (Chatbot Support)
app.use('/api/chat', require('./routes/chat'));

// 4. Port Configuration 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});