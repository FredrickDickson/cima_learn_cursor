const express = require('express');
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  replyToComment
} = require('../controllers/comments');
const { protect } = require('../middleware/auth');

router.route('/course/:courseId')
  .get(getComments)
  .post(protect, createComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route('/:id/reply')
  .post(protect, replyToComment);

module.exports = router;

