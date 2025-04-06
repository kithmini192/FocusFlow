// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,      // removes spaces at beginning and end
  },
  email: {
    type: String,
    required: true,
    unique: true,    // each email must be unique
    trim: true,
    lowercase: true, // automatically convert to lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6,    // password must be at least 6 characters
  }
}, { timestamps: true }); // automatically create createdAt and updatedAt fields

// Export the model
module.exports = mongoose.model('User', userSchema);
