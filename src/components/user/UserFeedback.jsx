/**
 * UserFeedback Component
 * 
 * A comprehensive feedback form component that allows users to submit feedback
 * about the application. Features form validation, success states, and localStorage
 * persistence for cross-component data sharing.
 * 
 * Features:
 * - Multi-category feedback system (Bug Report, Feature Request, General Feedback)
 * - Rich form validation with real-time feedback
 * - Rating system with interactive stars
 * - Success and error state management
 * - Responsive design for all screen sizes
 * - localStorage integration for data persistence
 * - Accessibility support with proper ARIA attributes
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { FaStar, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaPaperPlane, FaUser } from 'react-icons/fa';
import UserSidebar from '../../pages/UserPages/UserSidebar';

const UserFeedback = () => {
  // Form state management
  const [formData, setFormData] = useState({
    category: 'general',
    subject: '',
    message: '',
    rating: 0,
    userEmail: '',
    userName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  // Feedback categories
  const categories = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'general', label: 'General Feedback' },
    { value: 'ui', label: 'UI/UX Feedback' },
    { value: 'performance', label: 'Performance Issue' }
  ];

  // Load user data from localStorage on mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || 'user';
    const storedProfile = JSON.parse(localStorage.getItem(userRole === 'admin' ? 'adminProfile' : 'userProfile') || '{}');
    
    if (storedProfile.email) {
      setFormData(prev => ({
        ...prev,
        userEmail: storedProfile.email,
        userName: storedProfile.name || 'User'
      }));
    }
  }, []);

  /**
   * Handle form input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle rating selection
   * 
   * @param {number} rating - Selected rating (1-5)
   */
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  /**
   * Validate form data
   * 
   * @returns {boolean} - Whether form is valid
   */
  const validateForm = () => {
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    
    if (formData.subject.trim().length < 5) {
      setError('Subject must be at least 5 characters long');
      return false;
    }
    
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long');
      return false;
    }
    
    if (formData.rating === 0) {
      setError('Please provide a rating');
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create feedback object
      const feedback = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
      
      // Show success state
      setSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          category: 'general',
          subject: '',
          message: '',
          rating: 0,
          userEmail: formData.userEmail,
          userName: formData.userName
        });
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render star rating component
   * 
   * @returns {JSX.Element} Star rating component
   */
  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="text-2xl transition-colors duration-200 focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <FaStar 
              className={`${
                star <= (hoveredRating || formData.rating) 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
              } hover:text-yellow-400`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating > 0 && `${formData.rating}/5`}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 relative z-30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUser className="text-blue-600" />
                Submit Feedback
              </h1>
              <p className="text-gray-600 mt-2">
                Help us improve TaskFlow by sharing your thoughts, reporting bugs, or suggesting new features.
              </p>
            </div>

            {/* Success State */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <div>
                    <h3 className="text-green-800 font-medium">Feedback Submitted Successfully!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Thank you for your feedback. We'll review it and get back to you soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg" role="alert">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Brief summary of your feedback"
                  required
                  minLength={5}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.subject.length}/100 characters
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                {renderStarRating()}
                <p className="text-xs text-gray-500 mt-1">
                  How would you rate your overall experience with TaskFlow?
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  placeholder="Please provide detailed feedback, including steps to reproduce any issues or specific suggestions for improvements..."
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              {/* User Info (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 text-sm"
                    readOnly
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Your feedback helps us improve TaskFlow for everyone.
                </p>
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                    loading || success
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : success ? (
                    <>
                      <FaCheckCircle />
                      Submitted
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback; 