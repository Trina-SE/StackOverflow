// src/components/Login.js
import React, { useState } from 'react';
import API from '../api';

const Login = ({ closeForm }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear previous error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData); // Debugging log

      // Send username and password in the request
      const { data } = await API.post('/auth/login', formData);
      console.log('Login successful, received token:', data.token); // Debugging log

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.username); // Store username for later use
      alert('Login successful');
      window.location.href = '/dashboard'; // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
          <button type="button" className="close-btn" onClick={closeForm}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
