import React, { useEffect, useState } from 'react';
import API from '../api';
import PostForm from '../components/PostForm';
import io from 'socket.io-client';
import '../styles/Dashboard.css';

const socket = io('http://localhost');

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [expandedPostContent, setExpandedPostContent] = useState(null);
  const [showNotificationsPrompt, setShowNotificationsPrompt] = useState(false);

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
      setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setShowNotificationDot(data.some((notif) => !notif.read));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUnreadNotifications();

    const intervalId = setInterval(() => {
      fetchPosts();
      fetchUnreadNotifications();
    }, 2000); // Auto-refresh every 2 seconds

    socket.on('newPostNotification', (notification) => {
      if (notification.authorUsername !== username) {
        setNotifications((prev) => [notification, ...prev]);
        setShowNotificationDot(true);
      }
    });

    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount
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

  const toggleNotificationsPrompt = () => {
    setShowNotificationsPrompt((prev) => !prev);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setShowNotificationDot(notifications.some((notif) => !notif.read));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleViewPostFromNotification = async (postId, notificationId) => {
    handleViewPost(postId);
    await markNotificationAsRead(notificationId);
  };

  const handleViewPost = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setExpandedPostContent(null);
    } else {
      try {
        const { data } = await API.get(`/posts/${postId}`);
        setExpandedPostId(postId);
        setExpandedPostContent(data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    }
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

        <div className="notification-box">
          <button onClick={toggleNotificationsPrompt}>Notification</button>
          {showNotificationDot && <span className="notification-dot"></span>}
        </div>
      </div>

      {showPostForm && <PostForm onPostCreated={handlePostCreated} />}

      {showNotificationsPrompt && (
        <div className="notifications-prompt">
          <h4>Unread Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.read ? 'notification-read' : 'notification-unread'
                }`}
              >
                <p style={{ color: notification.read ? 'green' : 'red' }}>
                  Posted by: {notification.postId.author?.username || "Author Unknown"}
                </p>
                <button
                  onClick={() =>
                    handleViewPostFromNotification(
                      notification.postId._id,
                      notification._id
                    )
                  }
                >
                  View Post
                </button>
              </div>
            ))
          ) : (
            <p>No unread notifications</p>
          )}
          <button onClick={toggleNotificationsPrompt} className="close-prompt-button">
            Close
          </button>
        </div>
      )}

      <div className="posts-container">
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-item">
              <p className="author-name">Posted by: {post.author?.username || "Anonymous"}</p>
              <h3>{post.title}</h3>
              <br />
              <button onClick={() => handleViewPost(post._id)}>
                {expandedPostId === post._id ? "Hide Post" : "View Post"}
              </button>

              {expandedPostId === post._id && expandedPostContent && (
                <div className="post-details">
                  <h4><u>Post Details:</u></h4>
                  <p><u><strong>Language:</strong> {expandedPostContent.post.language || 'N/A'}</u></p>
                  
                  {expandedPostContent.codeContent && (
                    <div>
                      <strong><u>Code Snippet:</u></strong>
                      <pre>{expandedPostContent.codeContent}</pre>
                    </div>
                  )}

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
