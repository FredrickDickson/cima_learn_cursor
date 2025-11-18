const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    
    // Remove fields that we don't want to match exactly
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Course.find(JSON.parse(queryStr)).populate('instructor', 'name email').sort({ createdAt: -1 });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Course.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const courses = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: courses.length,
      pagination,
      data: courses
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email bio avatar');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get instructor courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;
    
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this course'
      });
    }
    
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this course'
      });
    }
    
    await course.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

