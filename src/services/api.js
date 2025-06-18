// API Service for Astitva Backend Integration
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000/api' 
  : '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  // GET request helper
  async get(endpoint, options = {}) {
    const { params, ...restOptions } = options;
    let url = endpoint;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url = queryString ? `${endpoint}?${queryString}` : endpoint;
    }
    
    return this.request(url, { method: 'GET', ...restOptions });
  }

  // POST request helper
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request helper
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request helper
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }

  // AI Chat
  async sendChatMessage(query) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Community Posts
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    return this.request(endpoint);
  }

  async createPost(postData) {
    return this.post('/posts', postData);
  }

  async likePost(postId, userId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Voting System
  async votePost(postId, userId, voteType) {
    return this.post(`/posts/${postId}/vote`, {
      user_id: userId,
      vote_type: voteType
    });
  }

  async voteComment(commentId, userId, voteType) {
    return this.post(`/comments/${commentId}/vote`, {
      user_id: userId,
      vote_type: voteType
    });
  }

  // Awards
  async awardPost(postId, userId, awardType, message = '') {
    return this.post(`/posts/${postId}/award`, {
      user_id: userId,
      award_type: awardType,
      message
    });
  }

  async getComments(postId) {
    return this.request(`/posts/${postId}/comments`);
  }

  async createComment(postId, commentData) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // Job Board
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/jobs?${queryString}` : '/jobs';
    return this.request(endpoint);
  }

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  // User Management
  async getUserProfile(userId, requestingUserId = null) {
    const params = requestingUserId ? { requesting_user_id: requestingUserId } : {};
    return this.get(`/users/${userId}`, { params });
  }

  async getUserPosts(userId, requestingUserId = null, page = 1) {
    const params = { 
      page,
      requesting_user_id: requestingUserId 
    };
    return this.get(`/users/${userId}/posts`, { params });
  }

  async followUser(userId, followerId) {
    return this.post(`/users/${userId}/follow`, {
      user_id: followerId
    });
  }

  async getUserFeed(userId, page = 1) {
    return this.get(`/users/${userId}/feed`, { 
      params: { page } 
    });
  }

  // Platform Statistics
  async getStats() {
    return this.request('/stats');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 