const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  enrollInCourse,
  updateProgress,
  getCourseProgress
} = require('../controllers/enrollments');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getEnrollments);

router.route('/:courseId')
  .post(protect, enrollInCourse);

router.route('/:courseId/progress')
  .get(protect, getCourseProgress)
  .put(protect, updateProgress);

module.exports = router;

