// src/components/Posts.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notification from './Notification'; // Notification component

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from your API or state management
    const fetchPosts = async () => {
      const response = await fetch('/api/posts'); // Replace with your API endpoint
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Recent Posts</h1>
      <Link to="/create-post">Create Post</Link>
      <Notification />
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.language}</p>
            <pre>{post.codeSnippet}</pre>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
