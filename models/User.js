// Import mongoose to create the model
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['servant', 'admin'],
    default: 'servant'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the User model
module.exports = mongoose.model('User', userSchema);