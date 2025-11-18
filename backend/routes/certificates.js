const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificates');
const { protect } = require('../middleware/auth');

router.get('/:courseId', protect, generateCertificate);

module.exports = router;

