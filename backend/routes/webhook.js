const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyPayment } = require('../controllers/payments');

// Paystack webhook endpoint
router.post('/', async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  const event = req.body;

  // Handle successful payment
  if (event.event === 'charge.success') {
    const { reference } = event.data;

    try {
      // Use the verify payment logic here
      req.body = { reference };
      await verifyPayment(req, res);
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(400).json({ success: false });
    }
  }

  res.status(200).json({ success: true });
});

module.exports = router;

