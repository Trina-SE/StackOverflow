// src/components/Register.js
import React, { useState } from 'react';
import API from '../api';

const Register = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear any previous error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Send registration request
      const response = await API.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert('Registration successful');
      localStorage.setItem('username', formData.username); // Save username in localStorage
      window.location.href = '/dashboard'; // Redirect to dashboard on success
    } catch (error) {
      if (error.response && error.response.data.error === 'Email already registered') {
        setError('This email is already registered. Please use a different email.');
      } else {
        console.error('Error in registration:', error);
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input name="email" type="text" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button type="submit">Sign Up</button>
          <button type="button" className="close-btn" onClick={closeForm}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
