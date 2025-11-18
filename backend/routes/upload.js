const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const path = require('path');

router.post('/video', protect, authorize('instructor', 'admin'), upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/videos/${req.file.filename}`
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/thumbnail', protect, authorize('instructor', 'admin'), upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/thumbnails/${req.file.filename}`
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

