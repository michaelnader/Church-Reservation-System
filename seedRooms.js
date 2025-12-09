// Script to seed predefined rooms into the database
// Run this once to populate your rooms: node seedRooms.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

// Load environment variables
dotenv.config();

// Predefined rooms data
const rooms = [
  {
    name: 'Main Hall',
    description: 'Large hall for church services and events. Capacity: 200 people.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8ee31?w=800'
  },
  {
    name: 'Sunday School Room',
    description: 'Classroom for Sunday school activities. Capacity: 30 children.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'
  },
  {
    name: 'Prayer Room',
    description: 'Quiet room for prayer and meditation. Capacity: 15 people.',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800'
  },
  {
    name: 'Youth Meeting Room',
    description: 'Room for youth activities and meetings. Capacity: 40 people.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800'
  },
  {
    name: 'Conference Room',
    description: 'Room for meetings and conferences. Capacity: 25 people.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  },
  {
    name: 'Choir Practice Room',
    description: 'Room for choir rehearsals. Capacity: 35 people.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
  }
];

// Function to seed rooms
const seedRooms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Delete existing rooms
    await Room.deleteMany();
    console.log('🗑️  Existing rooms deleted');

    // Insert predefined rooms
    await Room.insertMany(rooms);
    console.log('✅ Predefined rooms inserted successfully');

    // Close connection
    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding rooms:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedRooms();