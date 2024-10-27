// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Ensure this is the correct backend URL
});

// Automatically add token from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Improved Response Interceptor for Better Error Details
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Display detailed error message
      const message = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
      console.error(`API Error: ${error.response.status} - ${message}`);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
