const User = require('../models/User');

// @desc    Update user
// @route   PUT /api/users
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      avatar: req.body.avatar
    };
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

