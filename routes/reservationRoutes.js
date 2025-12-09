// Import express and controller
const express = require('express');
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/reservations - Create new reservation (protected)
router.post('/', protect, createReservation);

// GET /api/reservations/my - Get logged-in user's reservations (protected)
router.get('/my', protect, getMyReservations);

// GET /api/reservations - Get all reservations (protected)
router.get('/', protect, getAllReservations);

// GET /api/reservations/:id - Get single reservation by ID (protected)
router.get('/:id', protect, getReservationById);

// PATCH /api/reservations/:id/status - Update reservation status (protected)
router.patch('/:id/status', protect, updateReservationStatus);

// DELETE /api/reservations/:id - Cancel reservation (protected)
router.delete('/:id', protect, cancelReservation);

module.exports = router;