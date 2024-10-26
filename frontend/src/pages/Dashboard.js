// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the server

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const currentUserId = localStorage.getItem('userId'); // Assume userId is stored here

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
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
      // Show notification dot if the notification is not from the current user
      if (notification.author !== currentUserId) {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        setShowNotificationDot(true); // Show the red dot on the notification button
      }
    });

    return () => {
      socket.off('newPostNotification'); // Clean up socket listener
    };
  }, [currentUserId]);

  const handlePostCreated = () => {
    fetchPosts();
    setShowPostForm(false);
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  const handleNotificationClick = () => {
    setShowNotificationDot(false); // Remove red dot when viewed
  };

  return (
    <div>
      <h1>Your Dashboard</h1>
      
      {/* Notification Button */}
      <div onClick={handleNotificationClick} style={{ position: 'relative', cursor: 'pointer' }}>
        <button>Notification</button>
        {showNotificationDot && (
          <span style={{ 
            position: 'absolute', top: '0', right: '0', width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%' 
          }}></span>
        )}
        {notifications.length > 0 && (
          <div style={{ position: 'absolute', top: '20px', right: '0', backgroundColor: 'white', border: '1px solid black', padding: '10px' }}>
            <h4>New Posts</h4>
            {notifications.map((notification, index) => (
              <div key={index}>
                <p>{notification.title}</p>
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={togglePostForm}>
        {showPostForm ? 'Close Post Form' : 'Create New Post'}
      </button>
      {showPostForm && <PostForm onPostCreated={handlePostCreated} />}

      <div>
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>Language: {post.language}</p>
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
    </div>
  );
};

export default Dashboard;
