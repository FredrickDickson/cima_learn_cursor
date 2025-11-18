const Comment = require('../models/Comment');

// @desc    Get comments for a course
// @route   GET /api/comments/course/:courseId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      course: req.params.courseId,
      parentComment: null
    })
      .populate('user', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name avatar' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create comment
// @route   POST /api/comments/course/:courseId
// @access  Private
exports.createComment = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;
    req.body.user = req.user.id;

    const comment = await Comment.create(req.body);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is the commenter
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Make sure user is the commenter or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Reply to comment
// @route   POST /api/comments/:id/reply
// @access  Private
exports.replyToComment = async (req, res, next) => {
  try {
    const parentComment = await Comment.findById(req.params.id);

    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    const reply = await Comment.create({
      ...req.body,
      course: parentComment.course,
      user: req.user.id,
      parentComment: parentComment._id
    });

    // Add reply to parent comment
    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json({
      success: true,
      data: reply
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

