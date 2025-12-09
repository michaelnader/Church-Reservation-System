# 🙏 Church Service Building Reservation System - Backend API

A simple and clean Node.js backend API for managing church room reservations with time conflict detection.

## 📋 Features

- User authentication (Register & Login) with JWT
- **Read-only room viewing** (rooms are predefined)
- **Smart reservation system** with time overlap detection
- Users can create, view, and cancel their reservations
- Automatic validation to prevent double-booking

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
church-reservation-system/
├── config/
│   └── db.js                    # Database connection
├── models/
│   ├── User.js                  # User model
│   ├── Room.js                  # Room model
│   └── Reservation.js           # Reservation model
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── roomController.js        # Room logic (read-only)
│   └── reservationController.js # Reservation logic with validation
├── routes/
│   ├── authRoutes.js            # Authentication routes
│   ├── roomRoutes.js            # Room routes (GET only)
│   └── reservationRoutes.js     # Reservation routes
├── middleware/
│   └── authMiddleware.js        # JWT authentication middleware
├── .env                         # Environment variables
├── server.js                    # Main application file
├── seedRooms.js                 # Script to populate predefined rooms
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/church_reservation
JWT_SECRET=your_super_secret_jwt_key_change_this
```

### 3. Start MongoDB

Make sure MongoDB is running on your machine or use MongoDB Atlas.

### 4. Run the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Room Routes (`/api/rooms`) - READ ONLY

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/rooms` | Get all rooms | No |
| GET | `/api/rooms/:id` | Get room by ID | No |

**Note:** Create, Update, and Delete operations are NOT allowed. Rooms are predefined and read-only.

### Reservation Routes (`/api/reservations`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reservations` | Create reservation | Yes |
| GET | `/api/reservations/my` | Get user's reservations | Yes |
| GET | `/api/reservations` | Get all reservations | Yes |
| GET | `/api/reservations/:id` | Get reservation by ID | Yes |
| PATCH | `/api/reservations/:id/status` | Update status | Yes |
| DELETE | `/api/reservations/:id` | Cancel reservation | Yes |

## 📝 Example Requests

### Register User
```json
POST /api/auth/register
{
  "name": "John Servant",
  "email": "john@church.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@church.com",
  "password": "password123"
}
```

### Get All Rooms (No Auth Required)
```json
GET /api/rooms
```

### Create Reservation (With Time Validation)
```json
POST /api/reservations
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
{
  "room": "ROOM_ID",
  "date": "2024-12-25",
  "startTime": "10:00",
  "endTime": "12:00"
}
```

**Success Response:**
```json
{
  "message": "Reservation created successfully",
  "reservation": { ... }
}
```

**Time Conflict Response (409):**
```json
{
  "message": "This room is not available at this time",
  "conflict": {
    "date": "2024-12-25T00:00:00.000Z",
    "startTime": "10:30",
    "endTime": "13:00"
  }
}
```

### Get My Reservations
```json
GET /api/reservations/my
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
```

### Cancel Reservation
```json
DELETE /api/reservations/:id
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
```

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## ⚙️ Business Rules

### Room Management
- ✅ Rooms are **predefined** and **read-only**
- ❌ Users **cannot** create, edit, or delete rooms
- ✅ Users can only **view** available rooms

### Reservation Flow
1. User selects a room
2. User selects a date
3. User selects start time and end time
4. System checks for time conflicts
5. If available → Reservation created
6. If conflict → Error message returned

### Time Overlap Detection
The system automatically checks if:
- The selected room is already reserved on the same date
- The time range overlaps with existing reservations
- Only **pending** and **approved** reservations are checked
- **Rejected** reservations don't block time slots

### Example Scenarios

**Scenario 1: No Conflict ✅**
- Existing: 09:00 - 11:00
- New Request: 11:00 - 13:00
- Result: ✅ Allowed (no overlap)

**Scenario 2: Conflict ❌**
- Existing: 10:00 - 12:00
- New Request: 11:00 - 13:00
- Result: ❌ Blocked (overlap detected)

**Scenario 3: Conflict ❌**
- Existing: 11:00 - 13:00
- New Request: 10:00 - 12:00
- Result: ❌ Blocked (overlap detected)

**Scenario 4: No Conflict ✅**
- Existing: 09:00 - 10:00
- New Request: 10:00 - 11:00
- Result: ✅ Allowed (exact boundary, no overlap)

## 🎯 Key Changes from Previous Version

### ✅ What Changed:

1. **Room Controller** - Removed create, update, delete functions (read-only now)
2. **Room Routes** - Only GET endpoints available
3. **Reservation Controller** - Added time overlap validation logic
4. **Seed Script** - Added `seedRooms.js` to populate predefined rooms
5. **README** - Updated with new business rules and examples

### ✅ What Stayed the Same:

- Authentication system
- User management
- Reservation cancellation
- JWT protection
- Database models
- File structure

## 👨‍💻 Author

Created with ❤️ for church servants

