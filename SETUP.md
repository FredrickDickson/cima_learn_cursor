# Setup Instructions

## Quick Start

### 1. Install Dependencies

Run the following command to install all dependencies for both backend and frontend:

```bash
npm run install-all
```

This will:
- Install backend dependencies (Node.js/Express)
- Install frontend dependencies (React)

### 2. Set Up MongoDB

Make sure MongoDB is running on your system:

**Option 1: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
- Update the MONGODB_URI in `backend/.env` with your Atlas connection string

### 3. Configure Environment Variables

Create a `backend/.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediator-udemy
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

### 4. Start the Application

**Run both backend and frontend together:**
```bash
npm run dev
```

**Or run separately:**

Backend only:
```bash
npm run server
# or
cd backend && npm run dev
```

Frontend only:
```bash
npm run client
# or
cd frontend && npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## User Roles

### Student
- Browse courses
- Enroll in courses
- Watch lectures
- Track progress

### Instructor
- Create courses
- Manage course content
- View enrolled students
- Instructor dashboard

## First Steps

1. Register an account (choose Student or Instructor)
2. If Instructor: Go to Dashboard → Create Course
3. If Student: Browse Courses → Enroll → Start Learning

## Project Structure

```
.
├── backend/              # Node.js/Express Backend
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
├── frontend/             # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # State management
│   │   └── App.js      # Main component
│   └── package.json
└── package.json          # Root scripts
```

## Features Implemented

✅ User authentication (JWT)
✅ Role-based access (student/instructor)
✅ Course CRUD operations
✅ Course enrollment
✅ Progress tracking
✅ Video player integration
✅ Modern UI with Tailwind CSS
✅ Responsive design

## API Endpoints

### Auth
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Courses
- GET `/api/courses` - List courses
- GET `/api/courses/:id` - Get course details
- POST `/api/courses` - Create course (instructor)
- PUT `/api/courses/:id` - Update course (instructor)
- DELETE `/api/courses/:id` - Delete course (instructor)

### Enrollments
- GET `/api/enrollments` - List user enrollments
- POST `/api/enrollments/:courseId` - Enroll in course
- GET `/api/enrollments/:courseId/progress` - Get progress
- PUT `/api/enrollments/:courseId/progress` - Update progress

## Troubleshooting

### MongoDB not connecting
- Check if MongoDB is running: `mongod`
- Verify connection string in `.env`
- Try: `mongosh` to test connection

### Port already in use
- Change PORT in `backend/.env`
- Or kill process using the port

### Module not found errors
- Delete `node_modules` and reinstall
- Run `npm install` in both directories

### CORS issues
- Verify backend CORS configuration
- Check API URLs in frontend

## Next Steps

1. Add video upload functionality
2. Implement payment processing using PAYSTACK
3. Add course reviews and ratings
4. Create certificate generation
5. Add discussion forums
6. Implement search functionality
7. Add email notifications

## Support

For issues or questions, refer to the main README.md file.

