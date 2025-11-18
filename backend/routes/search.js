const express = require('express');
const router = express.Router();
const { searchCourses } = require('../controllers/search');

router.get('/', searchCourses);

module.exports = router;

