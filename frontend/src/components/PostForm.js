// src/components/PostForm.js
import React, { useState } from 'react';
import API from '../api';

const PostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    codeSnippet: '',
    language: 'javascript',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('codeSnippet', formData.codeSnippet);
    formDataObj.append('language', formData.language);
    if (file) formDataObj.append('file', file);

    try {
      await API.post('/posts/create', formDataObj, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Post created successfully');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Post Title" value={formData.title} onChange={handleChange} required />
      <textarea name="codeSnippet" placeholder="Code Snippet" value={formData.codeSnippet} onChange={handleChange} required />
      <select name="language" value={formData.language} onChange={handleChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;
