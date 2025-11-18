import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.level) params.level = filters.level;
      
      const res = await axios.get('http://localhost:5000/api/courses', { params });
      setCourses(res.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Courses</h1>
        
        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select
            className="px-4 py-2 border rounded-md"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="International Arbitration">International Arbitration</option>
            <option value="Commercial Mediation">Commercial Mediation</option>
            <option value="Labor Disputes">Labor Disputes</option>
            <option value="Investment Disputes">Investment Disputes</option>
          </select>

          <select
            className="px-4 py-2 border rounded-md"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{course.instructor?.name}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                <span className="font-bold text-primary">${course.price}</span>
              </div>
              {course.rating > 0 && (
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-sm">{course.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;

