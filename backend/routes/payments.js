const express = require('express');
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  getPaymentHistory
} = require('../controllers/payments');
const { protect } = require('../middleware/auth');

router.post('/initialize', protect, initializePayment);
router.post('/verify', verifyPayment); // Can be public or protected depending on webhook
router.get('/history', protect, getPaymentHistory);

module.exports = router;

