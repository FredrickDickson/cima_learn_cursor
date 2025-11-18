const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add comment content']
  },
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  },
  replies: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);

