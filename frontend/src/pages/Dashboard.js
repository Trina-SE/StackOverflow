// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';
import io from 'socket.io-client';
import '../styles/Dashboard.css';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track the ID of the expanded post
  const [expandedPostContent, setExpandedPostContent] = useState(null); // Store content of the expanded post

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
    if (expandedPostId === postId) {
      // Collapse the post details if it's already expanded
      setExpandedPostId(null);
      setExpandedPostContent(null);
    } else {
      try {
        const { data } = await API.get(`/posts/${postId}`);
        setExpandedPostId(postId); // Store only the post ID
        setExpandedPostContent(data); // Set the content of the expanded post
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    }
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
              <br></br>
              <button onClick={() => handleViewPost(post._id)}>
                {expandedPostId === post._id ? "Hide Post" : "View Post"}
              </button>

              {/* Display expanded post details if this post is selected */}
              {expandedPostId === post._id && expandedPostContent && (
                <div className="post-details">
                  <h4><u>Post Details:</u></h4>
                  <p><u><strong>Language:</strong> {expandedPostContent.post.language || 'N/A'}</u></p>
                  
                  {/* Display code snippet content if available */}
                  {expandedPostContent.codeContent && (
                    <div>
                      <strong><u>Code Snippet:</u></strong>
                      <pre>{expandedPostContent.codeContent}</pre>
                    </div>
                  )}

                  {/* Display uploaded file content if available */}
                  {expandedPostContent.uploadedFileContent && (
                    <div>
                      <strong><u>Uploaded File Content:</u></strong>
                      <pre>{expandedPostContent.uploadedFileContent}</pre>
                    </div>
                  )}
                </div>
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
