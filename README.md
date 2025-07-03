# TaskFlow - Task Management Application

A comprehensive task management application built with the MERN stack, featuring role-based authentication, real-time task management, advanced filtering, and administrative dashboards.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- **Role-based Authentication**: Secure login/logout with JWT tokens
- **User Management**: User registration, profile management, and role assignment
- **Task Management**: Create, edit, delete, and organize tasks
- **Real-time Updates**: Live task status updates across the application
- **Advanced Filtering**: Filter tasks by status, category, and search terms
- **Calendar Integration**: View tasks in calendar format
- **Notifications**: Real-time notifications for task updates and deadlines

### Admin Features
- **User Administration**: Manage user accounts and permissions
- **Task Oversight**: View and manage all tasks across the platform
- **Activity Logging**: Track user login/logout activities with IP addresses
- **Feedback Management**: Review and respond to user feedback
- **Analytics Dashboard**: Comprehensive statistics and reporting

### User Features
- **Personal Dashboard**: Kanban-style task board with drag-and-drop functionality
- **Task Creation**: Rich task creation with deadlines, priorities, and descriptions
- **Profile Management**: Update personal information and preferences
- **Feedback System**: Submit bug reports, feature requests, and general feedback
- **Task Analytics**: Personal task completion statistics

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and context API
- **React Router**: Client-side routing and navigation
- **TailwindCSS**: Utility-first CSS framework
- **React Icons**: Professional icon library
- **Chart.js**: Data visualization for analytics
- **React Toastify**: Toast notifications
- **DnD Kit**: Drag and drop functionality

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Development Tools
- **Vite**: Build tool and development server
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Git**: Version control

## Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB (v6.0.0 or higher)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to the server directory**
   ```bash
   cd server
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## Usage

### Getting Started

1. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

2. **Create an account**
   - Click "Sign Up" to create a new account
   - Choose your role (User or Admin)
   - Complete the registration form

3. **Login**
   - Use your credentials to log in
   - You'll be redirected to your role-specific dashboard

### User Workflow

1. **Dashboard Overview**
   - View your tasks in a Kanban-style board
   - Tasks are automatically categorized by progress status
   - Use drag-and-drop to move tasks between columns

2. **Creating Tasks**
   - Navigate to "Create Tasks" in the sidebar
   - Fill in task details including title, description, deadline, and priority
   - Tasks are automatically saved to your dashboard

3. **Managing Tasks**
   - Use the "Filter Tasks" feature to find specific tasks
   - Search by title or filter by completion status
   - Edit or delete tasks as needed

4. **Providing Feedback**
   - Use "Submit Feedback" to report bugs or request features
   - Choose from categories: Bug Report, Feature Request, General Feedback, UI/UX Feedback, Performance Issue
   - Rate your experience and provide detailed feedback

### Admin Workflow

1. **Admin Dashboard**
   - Access comprehensive platform statistics
   - View user activity and task completion rates
   - Monitor system health and performance

2. **User Management**
   - View all registered users
   - Manage user roles and permissions
   - Monitor user activity logs

3. **Task Management**
   - Oversee all tasks across the platform
   - Filter and search through all user tasks
   - Generate reports on task completion

4. **Feedback Management**
   - Review user feedback submissions
   - Update feedback status (Pending, Under Review, Resolved)
   - Export feedback data for analysis

## Project Structure

```
taskflow/
├── public/                 # Static assets
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable components
│   │   ├── admin/         # Admin-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── tasks/         # Task-related components
│   │   └── user/          # User-specific components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── AdminPages/    # Admin pages
│   │   └── UserPages/     # User pages
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── server/                # Backend server
│   ├── src/
│   │   ├── controller/    # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   └── routes/        # API routes
│   └── package.json
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Task Endpoints

#### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-id",
      "title": "Task Title",
      "description": "Task Description",
      "status": "incomplete",
      "priority": "high",
      "deadline": "2024-12-31T23:59:59.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

### User Management Endpoints (Admin Only)

#### GET /api/admin/users
Retrieve all users (admin only).

#### GET /api/admin/logs
Retrieve user activity logs (admin only).

#### DELETE /api/admin/logs/:id
Delete a specific log entry (admin only).

## Authentication

TaskFlow uses JWT (JSON Web Tokens) for authentication. The authentication flow works as follows:

1. **User Registration/Login**: Users provide credentials through the login form
2. **Token Generation**: Server validates credentials and generates a JWT token
3. **Token Storage**: Token is stored in localStorage on the client side
4. **Protected Routes**: Each protected route checks for valid token
5. **Role-based Access**: Different features are available based on user role

### Security Features
- Password hashing using bcryptjs
- JWT token expiration
- Protected API endpoints
- Role-based authorization
- CORS configuration for secure cross-origin requests

## Contributing

### Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use meaningful variable and function names
   - Write comments for complex logic
   - Maintain consistent indentation

2. **Component Structure**
   - Use functional components with hooks
   - Implement proper prop validation
   - Follow React best practices
   - Maintain separation of concerns

3. **Git Workflow**
   - Create feature branches for new developments
   - Write descriptive commit messages
   - Test thoroughly before submitting pull requests
   - Keep commits focused and atomic

### Testing

1. **Frontend Testing**
   ```bash
   npm run test
   ```

2. **Backend Testing**
   ```bash
   cd server
   npm run test
   ```

### Building for Production

1. **Frontend Build**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Performance Considerations

- **Code Splitting**: Implement lazy loading for route components
- **State Management**: Use React Context judiciously to avoid unnecessary re-renders
- **API Optimization**: Implement caching strategies for frequently accessed data
- **Bundle Size**: Regular analysis of bundle size and optimization
- **Image Optimization**: Use appropriate image formats and sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions about TaskFlow, please contact the development team or submit feedback through the application's feedback system.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: TaskFlow Development Team