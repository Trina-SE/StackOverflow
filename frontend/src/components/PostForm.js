// src/components/PostForm.js
import React, { useState } from 'react';
import API from '../api';
import '../styles/PostForm.css';

const PostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    codeSnippet: '',
    language: '',
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
    const token = localStorage.getItem('token');

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title.trim());
    if (formData.codeSnippet) formDataObj.append('codeSnippet', formData.codeSnippet);
    if (formData.language) formDataObj.append('language', formData.language);
    if (file) formDataObj.append('file', file);

    try {
      console.log("Form data being sent:", formDataObj);
      await API.post('/posts/create', formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create Post</h2>
      <label>Post Title</label>
      <input
        name="title"
        placeholder="Post Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <label>Code Snippet</label>
      <textarea
        name="codeSnippet"
        placeholder="Code Snippet (Optional)"
        value={formData.codeSnippet}
        onChange={handleChange}
      />

      <label>Language</label>
      <select name="language" value={formData.language} onChange={handleChange}>
        <option value="">Select Language (Optional)</option>
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