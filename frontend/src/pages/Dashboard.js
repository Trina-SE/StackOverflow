// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';
import PostDetailsModal from '../components/PostDetailsModal';
import io from 'socket.io-client';
import '../styles/Dashboard.css';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State to track selected post for modal

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

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

  const fetchUnreadNotifications = async () => {
    try {
      const { data } = await API.get('/notifications/unread', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
      setShowNotificationDot(data.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUnreadNotifications();

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
    fetchPosts();
    setShowPostForm(false);
  };

  const togglePostForm = () => {
    setShowPostForm((prev) => !prev);
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

  const handleViewPost = async (postId) => {
    try {
      const { data } = await API.get(`/posts/${postId}`);
      setSelectedPost(data); // Set the selected post data for modal display
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
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
              <p className="author-name">Posted by: {post.author?.username || "Anonymous"}</p>
              <h3>{post.title}</h3>
              {post.language && <p>Language: {post.language}</p>}
              <button onClick={() => handleViewPost(post._id)}>View Post</button> {/* View Post Button */}
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost.post}
          codeContent={selectedPost.codeContent}
          fileContent={selectedPost.uploadedFileContent}
          onClose={closeModal}
        />
      )}

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
