const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(averageRating.toFixed(1)),
      data: reviews
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews/course/:courseId
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    req.body.course = req.params.courseId;
    req.body.student = req.user.id;

    const review = await Review.create(req.body);

    // Update course rating
    const reviews = await Review.find({ course: req.params.courseId });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    course.rating = parseFloat((totalRating / reviews.length).toFixed(1));
    course.numberOfReviews = reviews.length;
    await course.save();

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this course' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is the reviewer
    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update course rating
    const reviews = await Review.find({ course: review.course });
    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    await Course.findByIdAndUpdate(review.course, {
      rating: parseFloat((totalRating / reviews.length).toFixed(1))
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is the reviewer
    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this review'
      });
    }

    await review.deleteOne();

    // Update course rating
    const reviews = await Review.find({ course: review.course });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      await Course.findByIdAndUpdate(review.course, {
        rating: parseFloat((totalRating / reviews.length).toFixed(1)),
        numberOfReviews: reviews.length
      });
    } else {
      await Course.findByIdAndUpdate(review.course, {
        rating: 0,
        numberOfReviews: 0
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

