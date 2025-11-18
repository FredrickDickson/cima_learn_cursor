import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">CIMA Learning</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/courses" className="text-gray-700 hover:text-primary transition">
              Courses
            </Link>

            {user ? (
              <>
                {user.role === 'instructor' && (
                  <Link
                    to="/instructor/dashboard"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    Instructor Dashboard
                  </Link>
                )}
                <Link
                  to="/my-courses"
                  className="text-gray-700 hover:text-primary transition"
                >
                  My Courses
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

