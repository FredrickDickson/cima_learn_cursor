# CIMA Learning Platform - Replit Configuration

## Overview
A full-stack Udemy-style learning platform for the Center for International Mediators and Arbitrators (CIMA). Built with React frontend and Node.js/Express backend.

## Project Structure
- **Frontend**: React application (port 5000 in development)
- **Backend**: Node.js/Express API (port 3001 in development)
- **Database**: In-memory MongoDB (mongodb-memory-server) for development

## Development Setup

### Environment Variables
The project uses different configurations for development and production:

**Backend (.env)**:
- PORT=3001
- MONGODB_URI (in-memory by default)
- JWT_SECRET
- Optional: PAYSTACK keys for payment processing
- Optional: SMTP settings for email notifications

**Frontend (.env)**:
- PORT=5000
- HOST=0.0.0.0
- REACT_APP_API_URL=http://localhost:3001
- DANGEROUSLY_DISABLE_HOST_CHECK=true (for Replit proxy)

### Running the Application
The application runs both frontend and backend concurrently using the "Start application" workflow, which executes `npm run dev`.

### Key Configuration Changes for Replit
1. **Backend**: Configured to run on localhost:3001 in development
2. **Frontend**: Configured to run on 0.0.0.0:5000 to work with Replit's proxy
3. **API Configuration**: Frontend uses dynamic API URL based on environment
4. **Host Check**: Disabled for development to allow iframe preview in Replit

## Deployment

### Production Configuration
In production, the backend serves the built React app as static files:
- Backend runs on port 5000 (0.0.0.0)
- Frontend is built and served from backend
- API calls use relative URLs (same domain)

### Deployment Commands
- Build: `npm run build` (builds React app)
- Start: `npm start` (starts backend in production mode)

### Replit Deployment
The project is configured for Replit autoscale deployment:
- Deployment target: autoscale
- Build command: `npm run build`
- Run command: `npm start`
- Configuration is stored in `.replit` file

To deploy: Click the "Deploy" button in Replit and the configuration will automatically be used.

## Architecture

### Backend (Node.js/Express)
- RESTful API with JWT authentication
- Role-based access control (student/instructor)
- In-memory MongoDB for easy development
- File upload support (multer)
- Payment integration (Paystack)
- PDF certificate generation

### Frontend (React)
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- React Player for video playback
- Axios for API calls

## Features
- User authentication and authorization
- Course management (CRUD operations)
- Video lectures and progress tracking
- Payment processing with Paystack
- Course reviews and ratings
- Discussion forums
- Certificate generation
- Search functionality

## Recent Changes (2024-11-20)
- Configured for Replit environment
- Set up development and production environments
- Configured workflows for concurrent frontend/backend development
- Updated API URLs to use environment-based configuration
- Configured deployment settings for production

## Notes
- The in-memory database resets on server restart (intended for development)
- Payment and email features require API keys to be configured
- For production, consider switching to a persistent MongoDB instance
