const express = require('express');
const router = express.Router();
const Item = require('../models/Items');
const auth = require('../middleware/auth');

// --- LIST A NEW ITEM ---
router.post('/add', auth, async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.body;
        const numericQuantity = Number(quantity);

        if (!numericQuantity || numericQuantity < 1) {
            return res.status(400).json({ msg: 'Quantity must be at least 1' });
        }

        const newItem = new Item({
            name,
            price,
            description,
            category,
            quantity: numericQuantity,
            sellerId: req.user.id,
            status: 'available'
        });

        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- SEARCH AND FILTER ITEMS ---
router.get('/', auth, async (req, res) => {
    try {
        const { search, categories } = req.query;
        const query = {};

        if (search && search.trim() !== '') {
            query.name = { $regex: search, $options: 'i' };
        }

        if (categories) {
            const categoryArray = categories.split(',');
            query.category = { $in: categoryArray };
        }

        const items = await Item.find(query)
            .populate('sellerId', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET MY LISTINGS (SELLER DASHBOARD) ---
router.get('/my-listings', auth, async (req, res) => {
    try {
        const items = await Item.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- UPDATE LISTING QUANTITY ---
router.put('/:id/quantity', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const numericQuantity = Number(quantity);

        if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
            return res.status(400).json({ msg: 'Quantity must be 0 or more' });
        }

        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (item.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to edit this listing' });
        }

        item.quantity = numericQuantity;
        // Consider reserved units when deciding availability
        const available = numericQuantity - (item.reserved || 0);
        item.status = available > 0 ? 'available' : 'out_of_stock';

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- UPDATE LISTING DETAILS ---
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.body;
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (item.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to edit this listing' });
        }

        if (name !== undefined) item.name = name;
        if (price !== undefined) item.price = Number(price);
        if (description !== undefined) item.description = description;
        if (category !== undefined) item.category = category;

        if (quantity !== undefined) {
            const numericQuantity = Number(quantity);
            if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
                return res.status(400).json({ msg: 'Quantity must be 0 or more' });
            }
            item.quantity = numericQuantity;
            // Consider reserved units when deciding availability
            const available = numericQuantity - (item.reserved || 0);
            item.status = available > 0 ? 'available' : 'out_of_stock';
        }

        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- DELETE LISTING ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        if (item.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this listing' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Listing deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET SINGLE ITEM BY ID ---
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate(
            'sellerId',
            'firstName lastName email age contactNumber'
        );

        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
