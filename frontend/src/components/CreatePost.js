// src/components/CreatePost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('c');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle file upload to MinIO and saving the post
    const formData = new FormData();
    formData.append('title', title);
    formData.append('language', language);
    formData.append('codeSnippet', codeSnippet);
    if (file) {
      formData.append('file', file);
    }

    await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });

    // Navigate back to posts page
    navigate('/posts');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <textarea
        placeholder="Code Snippet"
        value={codeSnippet}
        onChange={(e) => setCodeSnippet(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
