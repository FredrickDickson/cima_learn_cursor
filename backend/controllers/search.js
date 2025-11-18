const Course = require('../models/Course');

// @desc    Search courses
// @route   GET /api/search
// @access  Public
exports.searchCourses = async (req, res, next) => {
  try {
    const { q, category, level, minPrice, maxPrice } = req.query;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

