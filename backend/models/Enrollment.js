const mongoose = require('mongoose');

const LectureProgressSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course.lectures',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastPosition: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
});

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: [LectureProgressSchema],
  completedLectures: {
    type: Number,
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);

