// Import express and controller
const express = require('express');
const {
  getAllRooms,
  getRoomById
} = require('../controllers/roomController');

const router = express.Router();

// GET /api/rooms - Get all rooms (public - read-only)
router.get('/', getAllRooms);

// GET /api/rooms/:id - Get single room by ID (public - read-only)
router.get('/:id', getRoomById);

// NOTE: Create, Update, and Delete routes have been removed
// Rooms are predefined and read-only

module.exports = router;