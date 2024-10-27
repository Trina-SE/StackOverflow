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

  // Fetch posts and unseen notifications from the backend
  const fetchPostsAndNotifications = async () => {
    try {
      const { data: postData } = await API.get('/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(postData);

      const { data: unseenNotifications } = await API.get('/notifications/unseen', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (unseenNotifications.length > 0) {
        setNotifications(unseenNotifications);
        setShowNotificationDot(true);
      }
    } catch (error) {
      console.error('Error fetching posts or notifications:', error);
    }
  };

  useEffect(() => {
    fetchPostsAndNotifications();

    socket.on('newPostNotification', (notification) => {
      if (notification.authorUsername !== username) {
        setNotifications((prev) => [notification, ...prev]);
        setShowNotificationDot(true);
      }
    });

    return () => {
      socket.off('newPostNotification');
    };
  }, [username]);

  const handlePostCreated = () => {
    fetchPostsAndNotifications();
    setShowPostForm(false);
  };

  const handleNotificationClick = async () => {
    setShowNotificationDot(false);
    setNotifications([]);
    await API.put('/notifications/mark-seen', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

        <button onClick={() => setShowPostForm(!showPostForm)}>Create Post</button>

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
              <p className="author-name">Posted by: {post.author?.username || "Anonymous"}</p>
              <h3>{post.title}</h3>
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
