const axios = require('axios');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private
exports.initializePayment = async (req, res, next) => {
  try {
    const { courseId, email, callback_url } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Initialize Paystack payment
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || req.user.email,
        amount: Math.round(course.price * 100), // Convert to kobo (Nigerian) or cents
        currency: process.env.PAYSTACK_CURRENCY || 'GHS',
        callback_url: callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          custom_fields: [
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: req.user.id
            },
            {
              display_name: 'Course ID',
              variable_name: 'course_id',
              value: courseId
            }
          ],
          user_id: req.user.id,
          course_id: courseId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.response?.data?.message || err.message
    });
  }
};

// @desc    Verify payment and enroll
// @route   POST /api/payments/verify
// @access  Public (called from Paystack redirect)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.body;

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const transaction = response.data.data;

    if (transaction.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }

    // Extract metadata from Paystack response
    // Metadata can be in different formats depending on how it was sent
    let courseId, userId;
    
    if (transaction.metadata) {
      // Check if metadata.custom_fields array exists
      if (transaction.metadata.custom_fields && Array.isArray(transaction.metadata.custom_fields)) {
        const courseField = transaction.metadata.custom_fields.find(f => f.variable_name === 'course_id');
        const userField = transaction.metadata.custom_fields.find(f => f.variable_name === 'user_id');
        
        courseId = courseField?.value || transaction.metadata.course_id;
        userId = userField?.value || transaction.metadata.user_id;
      } else {
        // Direct metadata object
        courseId = transaction.metadata.course_id;
        userId = transaction.metadata.user_id;
      }
    }

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment metadata. Course: ${courseId}, User: ${userId}`
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled',
        data: existingEnrollment
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Initialize progress
    const progress = course.lectures.map((lecture, index) => ({
      lectureId: lecture._id,
      completed: false,
      lastPosition: 0
    }));

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
      progress,
      totalLectures: course.lectures.length
    });

    // Record payment
    await Payment.create({
      student: userId,
      course: courseId,
      amount: course.price,
      paymentIntentId: reference,
      status: 'succeeded',
      paystackReference: reference
    });

    // Update enrolled students count
    course.enrolledStudents += 1;
    await course.save();

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.response?.data?.message || err.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('course', 'title thumbnail price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

