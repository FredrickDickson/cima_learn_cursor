const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses
} = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/instructor/my-courses')
  .get(protect, authorize('instructor', 'admin'), getInstructorCourses);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;

