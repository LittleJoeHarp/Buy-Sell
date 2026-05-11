const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['clothing', 'grocery', 'electronics', 'other'] // Matches your frontend dropdown
    },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    reserved: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    status: { 
        type: String, 
        default: 'available',
        enum: ['available', 'out_of_stock'] 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Item', itemSchema);