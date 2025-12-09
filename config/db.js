// Import mongoose to connect to MongoDB
const mongoose = require('mongoose');

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit the app if database connection fails
  }
};

module.exports = connectDB;