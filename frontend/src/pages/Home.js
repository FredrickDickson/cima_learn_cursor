import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Center for International Mediators & Arbitrators
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Master the art of mediation and arbitration with our comprehensive online courses
            </p>
            <div className="space-x-4">
              <Link
                to="/courses"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
              >
                Browse Courses
              </Link>
              <Link
                to="/register"
                className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose CIMA Learning?</h2>
          <p className="text-gray-600 text-lg">Expert-led courses for professional development</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Curriculum</h3>
            <p className="text-gray-600">
              Courses covering all aspects of mediation and arbitration
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from experienced mediators and arbitrators
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Self-Paced Learning</h3>
            <p className="text-gray-600">
              Study at your own pace with lifetime access
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Course Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['International Arbitration', 'Commercial Mediation', 'Labor Disputes', 'Investment Disputes'].map((category) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <p className="text-gray-600">Explore courses in this category</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

