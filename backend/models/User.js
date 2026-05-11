const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // [cite: 16]
  lastName: { type: String, required: true },  // [cite: 17]
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    // FIXED REGEX: Removed the '@' from the start of the match
    match: [/iiit\.ac\.in$/, 'Please use a valid IIIT email address'] 
  },
  age: { type: Number, required: true }, // [cite: 19]
  contactNumber: { type: String, required: true }, // [cite: 20]
  password: { type: String, required: true }, // Stored as hashed string [cite: 21, 44]
  cart: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' 
  }], // Items added in the Cart [cite: 22]
  sellerReviews: [{
    reviewerName: String,
    rating: Number,
    comment: String
  }] // Reviews for that person [cite: 23]
});

module.exports = mongoose.model('User', userSchema);