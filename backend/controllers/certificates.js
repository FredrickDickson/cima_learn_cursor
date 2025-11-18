const PDFDocument = require('pdfkit');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const fs = require('fs');
const path = require('path');

// @desc    Generate certificate
// @route   GET /api/certificates/:courseId
// @access  Private
exports.generateCertificate = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    if (enrollment.completionPercentage < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course not completed yet'
      });
    }

    // Generate PDF certificate
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'LETTER'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="certificate.pdf"');

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height)
      .fill('#f8f9fa');

    // Border
    doc.strokeColor('#5624d0')
      .lineWidth(15)
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke();

    // Title
    doc.fontSize(40)
      .fillColor('#5624d0')
      .font('Helvetica-Bold')
      .text('CERTIFICATE OF COMPLETION', {
        align: 'center',
        y: 150
      });

    // Body text
    doc.fontSize(18)
      .fillColor('#333')
      .font('Helvetica')
      .text('This is to certify that', {
        align: 'center',
        y: 250
      });

    doc.fontSize(30)
      .fillColor('#5624d0')
      .font('Helvetica-Bold')
      .text(req.user.name.toUpperCase(), {
        align: 'center',
        y: 280
      });

    doc.fontSize(18)
      .fillColor('#333')
      .font('Helvetica')
      .text(`has successfully completed the course`, {
        align: 'center',
        y: 330
      });

    doc.fontSize(24)
      .fillColor('#5624d0')
      .font('Helvetica-Bold')
      .text(enrollment.course.title, {
        align: 'center',
        y: 360
      });

    doc.fontSize(12)
      .fillColor('#666')
      .text(`Completion Date: ${new Date().toLocaleDateString()}`, {
        align: 'center',
        y: 420
      });

    // Signature line
    doc.fontSize(12)
      .fillColor('#333')
      .text('Center for International Mediators & Arbitrators', {
        align: 'center',
        y: 480
      });

    doc.end();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

