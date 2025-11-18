const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lecture title']
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: [true, 'Please add a video URL']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a course description']
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lectures: [LectureSchema],
  totalDuration: {
    type: Number,
    default: 0
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numberOfReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);

