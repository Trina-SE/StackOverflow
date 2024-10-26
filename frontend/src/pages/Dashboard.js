// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false); // State to control form visibility

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure the user is authenticated
        const { data } = await API.get('/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    // Refresh the posts after creating a new one
    fetchPosts();
    setShowPostForm(false); // Hide form after post creation
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm); // Toggle form visibility
  };

  return (
    <div>
      <h1>Your Dashboard</h1>
      <button onClick={togglePostForm}>
        {showPostForm ? 'Close Post Form' : 'Create New Post'}
      </button>
      {showPostForm && <PostForm onPostCreated={handlePostCreated} />} {/* Conditionally render the form */}
      <div>
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>Language: {post.language}</p>
              <pre>{post.codeSnippet}</pre>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
