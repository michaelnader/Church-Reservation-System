// Import mongoose to create the model
const mongoose = require('mongoose');

// Define the Room schema
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    trim: true
  },
  image: {
    type: String, // URL string for the room image
    default: 'https://via.placeholder.com/400x300?text=Room+Image'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the Room model
module.exports = mongoose.model('Room', roomSchema);