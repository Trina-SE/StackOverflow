import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, formData);
            alert('User registered successfully');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
            <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
            <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
