import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ReactPlayer from 'react-player';

const MyCourses = () => {
  const { } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const { courseId, lectureId } = useParams();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (courseId && lectureId) {
      fetchLectureDetails(courseId, lectureId);
    }
  }, [courseId, lectureId]);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/enrollments');
      setEnrollments(res.data.data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLectureDetails = async (courseId, lectureId) => {
    try {
      const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      await axios.get(`http://localhost:5000/api/enrollments/${courseId}/progress`);
      
      setSelectedCourse(courseRes.data.data);
      const lecture = courseRes.data.data.lectures.find(l => l._id === lectureId);
      setSelectedLecture(lecture);
      setCurrentLectureId(lectureId);
    } catch (err) {
      console.error('Error fetching lecture details:', err);
    }
  };

  const handleProgressUpdate = async (completed) => {
    if (!currentLectureId) return;

    try {
      await axios.put(`http://localhost:5000/api/enrollments/${courseId}/progress`, {
        lectureId: currentLectureId,
        completed,
        lastPosition: 0,
      });
      fetchEnrollments();
    } catch (err) {
      console.error('Error updating progress:', err);
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

  // If viewing a specific lecture
  if (selectedCourse && selectedLecture) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">{selectedCourse.title}</h2>
            <div className="space-y-2">
              {selectedCourse.lectures.map((lecture, index) => (
                <Link
                  key={lecture._id}
                  to={`/my-courses/${courseId}/lecture/${lecture._id}`}
                  className={`block p-3 rounded ${
                    lecture._id === lectureId
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium">Lecture {index + 1}</div>
                  <div className="text-xs">{lecture.title}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-2xl font-semibold mb-4">{selectedLecture.title}</h3>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <ReactPlayer
                url={selectedLecture.videoUrl}
                controls
                width="100%"
                height="500px"
                onEnded={() => handleProgressUpdate(true)}
              />
            </div>
            <p className="text-gray-600">{selectedLecture.description}</p>
            <div className="mt-4">
              <button
                onClick={() => handleProgressUpdate(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
              >
                Mark as Complete
              </button>
              <Link
                to="/my-courses"
                className="ml-4 text-primary hover:underline"
              >
                Back to My Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Courses list view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition inline-block"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment._id}
              to={`/my-courses/${enrollment.course._id}/lecture/${enrollment.course.lectures[0]?._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {enrollment.course.thumbnail && (
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{enrollment.course.title}</h3>
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${enrollment.completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {enrollment.completionPercentage}% Complete
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {enrollment.completedLectures} of {enrollment.totalLectures} lectures completed
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

