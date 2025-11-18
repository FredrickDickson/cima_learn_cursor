const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

router.route('/').put(protect, updateUser);

module.exports = router;

