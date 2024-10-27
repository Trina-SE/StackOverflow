// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';
import io from 'socket.io-client';
import '../styles/Dashboard.css';

const socket = io('http://localhost:5000'); // Connect to the server

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Listen for new post notifications
    socket.on('newPostNotification', (notification) => {
      if (notification.authorUsername !== username) {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        setShowNotificationDot(true); // Show the red dot on the notification button
      }
    });

    return () => {
      socket.off('newPostNotification'); // Cleanup listener on unmount
    };
  }, [username]);

  const handlePostCreated = () => {
    fetchPosts();
    setShowPostForm(false);
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  const handleNotificationClick = () => {
    setShowNotificationDot(false);
    setNotifications([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="username-box">
          <span>{username}</span>
        </div>

        <button onClick={togglePostForm}>Create Post</button>

        <div className="notification-box" onClick={handleNotificationClick}>
          <button>Notification</button>
          {showNotificationDot && <span className="notification-dot"></span>}
        </div>
      </div>

      {showPostForm && <PostForm onPostCreated={handlePostCreated} />}

      <div className="posts-container">
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-item">
              <p className="author-name">Posted by: {post.authorUsername || "Anonymous"}</p>
              <h3>{post.title}</h3>
              {/* Conditionally render language if it exists */}
              {post.language && <p>Language: {post.language}</p>}
              {post.codeFileUrl && (
                <p>
                  Code Snippet File: <a href={post.codeFileUrl} download>Download Code</a>
                </p>
              )}
              {post.uploadedFileUrl && (
                <p>
                  Uploaded File: <a href={post.uploadedFileUrl} download>Download File</a>
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
