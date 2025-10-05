import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const API_BASE_URL = 'http://localhost:5000/api'; // pang test sa web
const API_BASE_URL = "http://10.0.2.2:5000/api"; // para sa android

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  register: (userData) => api.post("/users/register", userData),
  login: (credentials) => api.post("/users/login", credentials),
  getProfile: () => api.get("/users/profile"),
  getUserCluster: (userId) => api.get(`/users/${userId}/cluster`),
};

// Posts API calls
export const postsAPI = {
  createPost: (postData) => api.post("/posts", postData),
  ratePost: (postId, ratingData) =>
    api.post(`/posts/${postId}/rate`, ratingData),
  getClusterPosts: (clusterId) => api.get(`/posts/cluster/${clusterId}`),
};

// Clusters API calls
export const clustersAPI = {
  getAllClusters: () => api.get("/clusters"),
  getCluster: (clusterId) => api.get(`/clusters/${clusterId}`),
};

// Auth helper functions
export const authHelper = {
  storeToken: async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem("userToken");
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem("userToken");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  storeUserData: async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  },

  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  removeUserData: async () => {
    try {
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  },
};

export default api;
