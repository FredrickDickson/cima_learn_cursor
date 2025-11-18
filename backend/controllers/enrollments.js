const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { sendEnrollmentConfirmation, sendCompletionNotification } = require('./notifications');

// @desc    Get all enrollments for a user
// @route   GET /api/enrollments
// @access  Private
exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title description thumbnail instructor level price')
      .sort({ enrolledAt: -1 });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }
    
    // Initialize progress for all lectures
    const progress = course.lectures.map((lecture, index) => ({
      lectureId: lecture._id,
      completed: false,
      lastPosition: 0
    }));
    
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: req.params.courseId,
      progress,
      totalLectures: course.lectures.length
    });
    
    // Update enrolled students count
    course.enrolledStudents += 1;
    await course.save();

    // Send enrollment confirmation email
    const student = await User.findById(req.user.id);
    await sendEnrollmentConfirmation(student, course);
    
    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get course progress
// @route   GET /api/enrollments/:courseId/progress
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    }).populate('course');
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update lecture progress
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const { lectureId, completed, lastPosition } = req.body;
    
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    // Update lecture progress
    const lectureProgress = enrollment.progress.find(
      p => p.lectureId.toString() === lectureId
    );
    
    if (lectureProgress) {
      if (completed && !lectureProgress.completed) {
        lectureProgress.completed = true;
        lectureProgress.completedAt = new Date();
        enrollment.completedLectures += 1;
      } else if (!completed) {
        lectureProgress.completed = false;
        enrollment.completedLectures = Math.max(0, enrollment.completedLectures - 1);
      }
      lectureProgress.lastPosition = lastPosition || lectureProgress.lastPosition;
    }
    
    // Update completion percentage
    enrollment.completionPercentage = Math.round(
      (enrollment.completedLectures / enrollment.totalLectures) * 100
    );
    
    await enrollment.save();

    // Check if course is completed (100%)
    if (enrollment.completionPercentage === 100) {
      const student = await User.findById(req.user.id);
      const course = await Course.findById(enrollment.course);
      await sendCompletionNotification(student, course);
    }
    
    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

