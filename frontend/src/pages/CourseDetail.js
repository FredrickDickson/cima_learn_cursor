import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import config from '../config';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) checkEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/courses/${id}`);
      setCourse(res.data.data);
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/enrollments/${id}/progress`);
      setEnrolled(true);
    } catch (err) {
      // Not enrolled
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if course is free
    if (course.price === 0) {
      try {
        await axios.post(`${config.API_URL}/api/enrollments/${id}`);
        setEnrolled(true);
        alert('Successfully enrolled in course!');
        navigate('/my-courses');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to enroll');
      }
      return;
    }

    // Paid course - initialize Paystack payment
    setProcessingPayment(true);
    try {
      const response = await axios.post(
        `${config.API_URL}/api/payments/initialize`,
        {
          courseId: id,
          email: user.email,
          callback_url: `${window.location.origin}/payment/callback`
        }
      );

      // Redirect to Paystack payment page
      window.location.href = response.data.data.authorization_url;
    } catch (err) {
      console.error('Payment initialization error:', err);
      alert(err.response?.data?.message || 'Payment initialization failed');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Course not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.lectures?.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{lecture.title}</h3>
                      <p className="text-sm text-gray-600">{lecture.duration} minutes</p>
                    </div>
                    {enrolled ? (
                      <button
                        onClick={() => navigate(`/my-courses/${id}/lecture/${lecture._id}`)}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition"
                      >
                        Watch
                      </button>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg shadow-md p-6 border">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full mb-4 rounded" />
              )}
              
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary mb-2">${course.price}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span>{course.rating.toFixed(1)} ({course.numberOfReviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-semibold">{course.instructor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lectures:</span>
                  <span className="font-semibold">{course.lectures?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{course.totalDuration} hours</span>
                </div>
              </div>

              {enrolled ? (
                <button
                  onClick={() => navigate('/my-courses')}
                  className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition font-semibold"
                >
                  Continue Learning
                </button>
              ) : course.price === 0 ? (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-secondary transition font-semibold"
                >
                  Enroll Now - Free
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={processingPayment}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-secondary transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingPayment ? 'Processing...' : `Enroll Now - $${course.price}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;


