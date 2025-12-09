// Import Room model
const Room = require('../models/Room');

// Get all rooms (Read-only - users can only view rooms)
const getAllRooms = async (req, res) => {
  try {
    // Find all rooms in the database
    const rooms = await Room.find();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single room by ID (Read-only - users can only view rooms)
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find room by ID
    const room = await Room.findById(id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById
};