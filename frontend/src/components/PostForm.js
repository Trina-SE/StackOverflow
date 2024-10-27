// src/components/PostForm.js
import React, { useState } from 'react';
import API from '../api';
import '../styles/PostForm.css';

const PostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    codeSnippet: '',
    language: '', // Default empty string for optional selection
  });
  const [file, setFile] = useState(null);

  // Handle input changes for title, codeSnippet, and language
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    // Create FormData object to send with request
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title); // Required field

    // Add optional fields only if provided
    if (formData.codeSnippet) formDataObj.append('codeSnippet', formData.codeSnippet);
    if (formData.language) formDataObj.append('language', formData.language);
    if (file) formDataObj.append('file', file);

    try {
      // Send POST request to backend to create post
      await API.post('/posts/create', formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Post created successfully');
      onPostCreated(); // Callback to refresh the post list or close the form
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create Post</h2>

      <label>Post Title</label>
      <input
        name="title"
        placeholder="Post Title"
        value={formData.title}
        onChange={handleChange}
        required // Only required field
      />

      <label>Code Snippet</label>
      <textarea
        name="codeSnippet"
        placeholder="Code Snippet (optional)"
        value={formData.codeSnippet}
        onChange={handleChange}
      />

      <label>Extension</label>
      <select name="language" value={formData.language} onChange={handleChange}>
        <option value="">No Extension</option> {/* Default placeholder */}
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <label>File</label>
      <input type="file" onChange={handleFileChange} />

      <button type="submit">Post</button>
      <button type="button" onClick={() => onPostCreated()}>Back</button>
    </form>
  );
};

export default PostForm;
