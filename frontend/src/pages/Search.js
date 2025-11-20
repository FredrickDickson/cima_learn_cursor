import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const q = searchParams.get('q');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/search?q=${q}`);
        setCourses(res.data.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (q) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [q]);

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
      <h1 className="text-3xl font-bold mb-8">Search Results for "{q}"</h1>
      {courses.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  By {course.instructor?.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">${course.price}</span>
                  <Link to={`/courses/${course._id}`} className="text-sm text-primary hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses found for your search query.</p>
      )}
    </div>
  );
};

export default Search;
