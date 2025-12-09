// Import Reservation model
const Reservation = require('../models/Reservation');

// Helper function to convert time string (HH:MM) to minutes for comparison
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if two time ranges overlap
const hasTimeOverlap = (start1, end1, start2, end2) => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  // Check if ranges overlap
  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

// Create a new reservation with time overlap validation
const createReservation = async (req, res) => {
  try {
    const { room, date, startTime, endTime } = req.body;

    // Check if all fields are provided
    if (!room || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Validate that end time is after start time
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Convert the date to start and end of day for comparison
    const reservationDate = new Date(date);
    const startOfDay = new Date(reservationDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(reservationDate.setHours(23, 59, 59, 999));

    // Check for existing reservations on the same date and room
    const existingReservations = await Reservation.find({
      room: room,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'rejected' } // Only check pending and approved reservations
    });

    // Check if there's a time overlap with any existing reservation
    for (let reservation of existingReservations) {
      if (hasTimeOverlap(startTime, endTime, reservation.startTime, reservation.endTime)) {
        return res.status(409).json({ 
          message: 'This room is not available at this time',
          conflict: {
            date: reservation.date,
            startTime: reservation.startTime,
            endTime: reservation.endTime
          }
        });
      }
    }

    // If no overlap, create the reservation
    const reservation = await Reservation.create({
      user: req.user.id, // Get user ID from auth middleware
      room,
      date: reservationDate,
      startTime,
      endTime,
      status: 'pending'
    });

    // Populate user and room information
    await reservation.populate('user', 'name email');
    await reservation.populate('room', 'name description image');

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reservations for the logged-in user
const getMyReservations = async (req, res) => {
  try {
    // Find all reservations for the current user
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('room', 'name description image')
      .sort({ date: -1 }); // Sort by date, newest first

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reservations (for viewing all)
const getAllReservations = async (req, res) => {
  try {
    // Find all reservations
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('room', 'name description image')
      .sort({ date: -1 }); // Sort by date, newest first

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single reservation by ID
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reservation by ID
    const reservation = await Reservation.findById(id)
      .populate('user', 'name email')
      .populate('room', 'name description image');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update reservation status (for admin approval/rejection)
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update reservation
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('room', 'name description image');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({
      message: 'Reservation status updated successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel reservation (user can cancel their own reservation)
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reservation
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the reservation belongs to the logged-in user
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(id);

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation
};