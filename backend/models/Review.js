const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews
ReviewSchema.index({ course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);

