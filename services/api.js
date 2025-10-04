import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

const API_BASE_URL = 'http://10.0.2.2:5000/api'; // For Android emulator




const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// User API calls
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  getUserCluster: (userId) => api.get(`/users/${userId}/cluster`),
};

// Posts API calls
export const postsAPI = {
  createPost: (postData) => api.post('/posts', postData),
  ratePost: (postId, ratingData) => api.post(`/posts/${postId}/rate`, ratingData),
  getClusterPosts: (clusterId) => api.get(`/posts/cluster/${clusterId}`),
};

// Clusters API calls
export const clustersAPI = {
  getAllClusters: () => api.get('/clusters'),
  getCluster: (clusterId) => api.get(`/clusters/${clusterId}`),
};

export default api;