const sendEmail = require('../config/email');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Send enrollment confirmation
exports.sendEnrollmentConfirmation = async (student, course) => {
  try {
    await sendEmail({
      email: student.email,
      subject: `Welcome to ${course.title}!`,
      message: `
        <h2>Welcome to ${course.title}!</h2>
        <p>Dear ${student.name},</p>
        <p>You have successfully enrolled in ${course.title}.</p>
        <p>Start learning by accessing your course at: <a href="${process.env.FRONTEND_URL}/my-courses">My Courses</a></p>
        <p>Happy Learning!</p>
        <p>Best regards,<br>CIMA Learning Platform</p>
      `
    });
  } catch (err) {
    console.error('Error sending enrollment email:', err);
  }
};

// Send course completion notification
exports.sendCompletionNotification = async (student, course) => {
  try {
    await sendEmail({
      email: student.email,
      subject: `Congratulations! You Completed ${course.title}`,
      message: `
        <h2>Congratulations on Completing ${course.title}!</h2>
        <p>Dear ${student.name},</p>
        <p>You have successfully completed all lectures in ${course.title}.</p>
        <p>You can now download your certificate from: <a href="${process.env.FRONTEND_URL}/my-courses">My Courses</a></p>
        <p>Well done and keep learning!</p>
        <p>Best regards,<br>CIMA Learning Platform</p>
      `
    });
  } catch (err) {
    console.error('Error sending completion email:', err);
  }
};

// Send new course notification
exports.sendNewCourseNotification = async (instructors, course) => {
  try {
    for (const instructor of instructors) {
      await sendEmail({
        email: instructor.email,
        subject: `New Course: ${course.title}`,
        message: `
          <h2>New Course Available: ${course.title}</h2>
          <p>Dear ${instructor.name},</p>
          <p>A new course has been added to our platform.</p>
          <p><strong>Course:</strong> ${course.title}</p>
          <p><strong>Instructor:</strong> ${course.instructor.name}</p>
          <p><strong>Level:</strong> ${course.level}</p>
          <p>Check it out here: <a href="${process.env.FRONTEND_URL}/courses/${course._id}">View Course</a></p>
          <p>Best regards,<br>CIMA Learning Platform</p>
        `
      });
    }
  } catch (err) {
    console.error('Error sending new course email:', err);
  }
};

