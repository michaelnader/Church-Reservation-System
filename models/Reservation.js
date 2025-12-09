// Import mongoose to create the model
const mongoose = require('mongoose');

// Define the Reservation schema
const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Reference to Room model
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the Reservation model
module.exports = mongoose.model('Reservation', reservationSchema);