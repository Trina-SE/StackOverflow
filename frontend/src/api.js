// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Make sure this is the correct backend URL
});

// Optional: Automatically add token from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
