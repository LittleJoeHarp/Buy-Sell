const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Item = require('../models/Items');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// --- 1. CHECKOUT (Create Orders from Cart) ---
router.post('/checkout', auth, async (req, res) => {
    try {
        // Find user using ID from middleware
        const user = await User.findById(req.user.id).populate('cart');
        
        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ msg: "Cart is empty" });
        }

        const ordersCreated = [];
        const reservedItemIds = [];

        for (const item of user.cart) {
            // Reserve one unit atomically by increasing `reserved` only when (quantity - reserved) > 0
            const reserved = await Item.findOneAndUpdate(
                { _id: item._id, $expr: { $gt: [ { $subtract: ["$quantity", { $ifNull: ["$reserved", 0] } ] }, 0 ] } },
                { $inc: { reserved: 1 } },
                { new: true }
            );

            if (!reserved) {
                // rollback reserved increments done so far
                for (const reservedId of reservedItemIds) {
                    await Item.findByIdAndUpdate(reservedId, { $inc: { reserved: -1 } });
                }
                return res.status(400).json({ msg: `${item.name} is out of stock or fully reserved. Please update your cart.` });
            }

            reservedItemIds.push(item._id);

            // Generate 6-digit OTP
            const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Hash OTP for secure verification
            const salt = await bcrypt.genSalt(10);
            const hashedOtp = await bcrypt.hash(plainOtp, salt);

            const newOrder = new Order({
                transactionId: uuidv4(),
                buyerId: user._id,
                sellerId: item.sellerId,
                itemId: item._id,
                amount: item.price,
                itemName: item.name,
                hashedOtp: hashedOtp,
                plainOtp: plainOtp,
                status: 'pending'
            });

            await newOrder.save();

            ordersCreated.push({ item: item.name, otp: plainOtp });
        }

        // Empty the cart
        user.cart = [];
        await user.save();

        res.json({ msg: "Order placed successfully", orders: ordersCreated });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET ORDER HISTORY (For Buyer & Seller) ---
router.get('/history', auth, async (req, res) => {
    try {
        // Pending: I am the buyer, item not delivered yet
        const pending = await Order.find({ buyerId: req.user.id, status: 'pending' })
            .populate('sellerId', 'firstName lastName email');

        // Bought: I am the buyer, transaction completed
        const bought = await Order.find({ buyerId: req.user.id, status: 'completed' })
            .populate('sellerId', 'firstName lastName');

        // Sold: I am the seller, transaction completed
        const sold = await Order.find({ sellerId: req.user.id, status: 'completed' })
            .populate('buyerId', 'firstName lastName');

        res.json({ pending, bought, sold });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 3. GET ORDERS RECEIVED (For Seller to view what they need to deliver) ---
router.get('/received', auth, async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user.id, status: 'pending' })
            .populate('buyerId', 'firstName lastName email');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 4. VERIFY OTP AND CLOSE TRANSACTION ---
router.post('/verify-otp', auth, async (req, res) => {
    const { orderId, otpInput } = req.body; 
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        // Security check: Only the designated seller can verify this
        if (order.sellerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized to verify this delivery" });
        }

        const isMatch = await bcrypt.compare(otpInput, order.hashedOtp);

        if (isMatch) {
            order.status = 'completed';
            await order.save();

            // After successful verification:
            //  - decrement actual `quantity` (finalize sale)
            //  - decrement `reserved`
            //  - update status based on remaining quantity
            if (order.itemId) {
                const item = await Item.findById(order.itemId);
                if (item) {
                    // decrement reserved if present
                    if (item.reserved && item.reserved > 0) item.reserved = item.reserved - 1;

                    // finalize sale by decrementing quantity (but never below 0)
                    item.quantity = Math.max(0, (item.quantity || 0) - 1);

                    // set status based on remaining quantity
                    item.status = item.quantity > 0 ? 'available' : 'out_of_stock';

                    await item.save();
                }
            }
            res.json({ msg: "Transaction closed successfully!" });
        } else {
            res.status(400).json({ msg: "Incorrect OTP. Transaction remains open." });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

// --- 5. CANCEL PENDING ORDER (Buyer) ---
router.post('/cancel/:orderId', auth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Only buyer can cancel their pending order
        if (order.buyerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to cancel this order' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ msg: 'Only pending orders can be cancelled' });
        }

        // Mark order cancelled
        order.status = 'cancelled';
        await order.save();

        // Restore reserved or quantity depending on the model state
        if (order.itemId) {
            const item = await Item.findById(order.itemId);
            if (item) {
                if (typeof item.reserved === 'number') {
                    // New flow: decrement reserved
                    item.reserved = Math.max(0, (item.reserved || 0) - 1);
                    // If there are still available units, mark available
                    if ((item.quantity || 0) - (item.reserved || 0) > 0) {
                        item.status = 'available';
                    }
                } else {
                    // Legacy flow: increment quantity back
                    item.quantity = (item.quantity || 0) + 1;
                    if (item.quantity > 0) item.status = 'available';
                }
                await item.save();
            }
        }

        res.json({ msg: 'Order cancelled and stock restored' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});