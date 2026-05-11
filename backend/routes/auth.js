const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

// --- VERIFY RECAPTCHA TOKEN ---
const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            {},
            {
                params: {
                    secret: RECAPTCHA_SECRET_KEY,
                    response: token
                }
            }
        );
        return response.data.success && response.data.score > 0.5;
    } catch (err) {
        console.error('reCAPTCHA verification failed:', err);
        return false;
    }
};

// --- REGISTRATION ROUTE (WITH RECAPTCHA) ---
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, contactNumber, password, recaptchaToken } = req.body;

        // Verify reCAPTCHA token
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ msg: 'reCAPTCHA verification failed. Please try again.' });
        }

        // 1. Email Validation (Subdomain friendly)
        if (!email.endsWith('iiit.ac.in')) {
            return res.status(400).json({ msg: "Only IIIT emails are permitted." }); 
        }

        // 2. Check if user already exists 
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 3. Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        // 4. Create and Save 
        user = new User({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // --- KEY FIX: MATCH THE MIDDLEWARE PAYLOAD ---
        const payload = {
            user: {
                id: user._id 
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                
                // Return token AND full user data for the Profile Page
                res.json({
                    token,
                    user: { 
                        id: user._id, 
                        firstName: user.firstName, 
                        lastName: user.lastName,
                        email: user.email,
                        age: user.age,
                        contactNumber: user.contactNumber
                    }
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CAS LOGIN ROUTE ---
router.post('/cas-login', async (req, res) => {
    try {
        const { ticket } = req.body;

        if (!ticket) {
            return res.status(400).json({ msg: 'CAS ticket is required' });
        }

        // Verify ticket with CAS server (IIIT Hyderabad uses CAS)
        const casServiceUrl = 'https://login.iiit.ac.in/cas/serviceValidate';
        const appUrl = 'http://localhost:5173/auth/cas-callback';

        try {
            const response = await axios.get(casServiceUrl, {
                params: {
                    service: appUrl,
                    ticket: ticket
                }
            });

            // Parse CAS response to extract username
            const responseText = response.data;
            const userMatch = responseText.match(/<cas:user>([^<]+)<\/cas:user>/);

            if (!userMatch || !userMatch[1]) {
                return res.status(401).json({ msg: 'Invalid CAS ticket' });
            }

            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({
                    msg: 'CAS login could not complete because the database is not connected. Check your MongoDB Atlas IP whitelist or MONGO_URI.'
                });
            }

            const username = userMatch[1];
            const email = `${username}@iiit.ac.in`;

            // Find or create user from CAS
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user from CAS data
                user = new User({
                    firstName: username,
                    lastName: 'IIIT User',
                    email: email,
                    age: 20,
                    contactNumber: '0000000000',
                    password: await bcrypt.hash(ticket, 10) // Use ticket as secure password
                });
                await user.save();
            }

            // Generate JWT token
            const payload = {
                user: {
                    id: user._id
                }
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    contactNumber: user.contactNumber
                }
            });
        } catch (casError) {
            console.error('CAS validation error:', casError.message);
            return res.status(401).json({ msg: 'CAS authentication failed' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;