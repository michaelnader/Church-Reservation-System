// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: '🙏 Church Service Building Reservation System API' });
});

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/rooms', roomRoutes); // Room routes
app.use('/api/reservations', reservationRoutes); // Reservation routes
app.use('/api/users', userRoutes);

// Handle 404 - Route not found
app.use((req, res, next) => {
  res.status(404);
  next(new Error('Route not found'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});