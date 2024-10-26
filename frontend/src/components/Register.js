import React, { useState } from 'react';
import API from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData); // Uses the correct baseURL
      alert('Registration successful');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;
