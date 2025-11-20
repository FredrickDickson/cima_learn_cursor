const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupTestDB } = require('./setupTestDB');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/search', require('./routes/search'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/webhook/paystack', require('./routes/webhook'));

// Start server with in-memory MongoDB
const startServer = async () => {
  try {
    const mongoUri = await setupTestDB();

    await mongoose.connect(mongoUri);

    console.log('MongoDB Connected (In-Memory)');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

