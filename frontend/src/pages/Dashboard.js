import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mb-4">Email: {user?.email}</p>
        <p className="text-gray-600 mb-4">Role: {user?.role}</p>
        
        <div className="flex space-x-4">
          <Link
            to="/courses"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition"
          >
            Browse Courses
          </Link>
          <Link
            to="/my-courses"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

