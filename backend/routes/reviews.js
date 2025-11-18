const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

router.route('/course/:courseId')
  .get(getReviews)
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;

