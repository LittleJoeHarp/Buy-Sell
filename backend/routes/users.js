const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Item = require('../models/Items');

// --- GET PROFILE DETAILS ---
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- UPDATE PROFILE DETAILS ---
router.put('/profile', auth, async (req, res) => {
    const { firstName, lastName, age, contactNumber } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        user.contactNumber = contactNumber || user.contactNumber;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET CART WITH POPULATED ITEMS ---
router.get('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart',
            populate: {
                path: 'sellerId',
                select: 'firstName lastName email'
            }
        });

        res.json(user?.cart || []);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- ADD ITEM TO CART ---
router.post('/cart/add/:itemId', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (item.status === 'out_of_stock' || item.quantity <= 0) {
            return res.status(400).json({ msg: 'This item is out of stock' });
        }

        if (item.sellerId.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot buy your own item!' });
        }

        const user = await User.findById(req.user.id);
        if (!user.cart.includes(req.params.itemId)) {
            user.cart.push(req.params.itemId);
            await user.save();
        }

        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- REMOVE ITEM FROM CART ---
router.delete('/cart/:itemId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter((id) => id.toString() !== req.params.itemId);
        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- ADD REVIEW FOR A SELLER ---
router.post('/reviews/:sellerId', auth, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
        }

        if (req.user.id === req.params.sellerId) {
            return res.status(400).json({ msg: 'You cannot review yourself' });
        }

        const reviewer = await User.findById(req.user.id);
        const seller = await User.findById(req.params.sellerId);

        if (!reviewer || !seller) {
            return res.status(404).json({ msg: 'User not found' });
        }

        seller.sellerReviews.push({
            reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
            rating: numericRating,
            comment: comment || ''
        });

        await seller.save();
        res.json({ msg: 'Review submitted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- DELETE A REVIEW FROM MY PROFILE ---
router.delete('/reviews/:reviewId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const exists = user.sellerReviews.some(
            (review) => review._id.toString() === req.params.reviewId
        );

        if (!exists) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        user.sellerReviews = user.sellerReviews.filter(
            (review) => review._id.toString() !== req.params.reviewId
        );

        await user.save();
        res.json({ msg: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
