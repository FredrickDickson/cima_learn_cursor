import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses/instructor/my-courses');
      setCourses(res.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', formData);
      fetchCourses();
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        price: 0,
        thumbnail: '',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
        fetchCourses();
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, WebM, or OGG)');
        return;
      }
      // Validate file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        alert('Video file size must be less than 500MB');
        return;
      }
      setSelectedVideo(file);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedVideo) {
      alert('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo);

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post('http://localhost:5000/api/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (res.data.success) {
        // Get the full URL
        const videoUrl = `http://localhost:5000${res.data.data.url}`;
        setUploadedVideoUrl(videoUrl);
        alert('Video uploaded successfully! Copy the URL to use in your course.');
        setSelectedVideo(null);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Failed to upload video');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG or PNG)');
        return;
      }

      const formData = new FormData();
      formData.append('thumbnail', file);

      try {
        const res = await axios.post('http://localhost:5000/api/upload/thumbnail', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data.success) {
          const thumbnailUrl = `http://localhost:5000${res.data.data.url}`;
          setFormData({ ...formData, thumbnail: thumbnailUrl });
          alert('Thumbnail uploaded successfully!');
        }
      } catch (err) {
        console.error('Thumbnail upload error:', err);
        alert(err.response?.data?.message || 'Failed to upload thumbnail');
      }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
        >
          {showForm ? 'Cancel' : '+ Create Course'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleThumbnailSelect}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Or enter URL:</p>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-md mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                📤 Upload Video
              </button>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
            >
              Create Course
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.lectures?.length || 0} lectures</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">${course.price}</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/courses/${course._id}/edit`)}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Upload Video</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedVideo(null);
                  setUploadedVideoUrl('');
                  setUploadProgress(0);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Video File</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoSelect}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: MP4, WebM, OGG (Max: 500MB)
                </p>
                {selectedVideo && (
                  <p className="text-sm text-gray-700 mt-2">
                    Selected: {selectedVideo.name} ({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {uploading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadedVideoUrl && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    ✓ Video uploaded successfully!
                  </p>
                  <p className="text-xs text-green-700 mb-2">Video URL:</p>
                  <input
                    type="text"
                    value={uploadedVideoUrl}
                    readOnly
                    className="w-full px-2 py-1 border rounded text-xs bg-white font-mono"
                    onClick={(e) => e.target.select()}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleVideoUpload}
                  disabled={!selectedVideo || uploading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedVideo(null);
                    setUploadedVideoUrl('');
                    setUploadProgress(0);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;

