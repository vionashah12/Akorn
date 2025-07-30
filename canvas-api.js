const axios = require('axios');
const config = require('./config');

class CanvasAPI {
  constructor() {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get all assignments for a specific course
   * @param {string|number} courseId - The Canvas course ID
   * @param {Object} options - Additional query parameters
   * @returns {Promise<Array>} Array of assignments
   */
  async getAssignments(courseId, options = {}) {
    try {
      const response = await this.client.get(`/courses/${courseId}/assignments`, {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error.message);
      throw error;
    }
  }

  /**
   * Get a specific assignment by ID
   * @param {string|number} courseId - The Canvas course ID
   * @param {string|number} assignmentId - The assignment ID
   * @returns {Promise<Object>} Assignment details
   */
  async getAssignment(courseId, assignmentId) {
    try {
      const response = await this.client.get(`/courses/${courseId}/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error.message);
      throw error;
    }
  }

  /**
   * Get all courses for the authenticated user
   * @param {Object} options - Additional query parameters
   * @returns {Promise<Array>} Array of courses
   */
  async getCourses(options = {}) {
    try {
      const response = await this.client.get('/courses', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      throw error;
    }
  }

  /**
   * Get course details by ID
   * @param {string|number} courseId - The Canvas course ID
   * @returns {Promise<Object>} Course details
   */
  async getCourse(courseId) {
    try {
      const response = await this.client.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error.message);
      throw error;
    }
  }

  /**
   * Get user profile information
   * @returns {Promise<Object>} User profile
   */
  async getUserProfile() {
    try {
      const response = await this.client.get('/users/self/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      throw error;
    }
  }
}

module.exports = CanvasAPI; 