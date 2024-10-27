// src/components/Notification.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notification = ({ currentUserId, onNewPost }) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    socket.on('newPost', (data) => {
      // Only show notification if the post is not from the current user
      if (data.authorId !== currentUserId) {
        setHasNewNotification(true);
        setNewPost(data.post); // Store the new post data
      }
    });

    return () => {
      socket.off('newPost'); // Cleanup event listener on component unmount
    };
  }, [currentUserId]);

  const handleClick = () => {
    setHasNewNotification(false);
    if (newPost) {
      onNewPost(newPost); // Pass the new post to the parent component to display
      setNewPost(null); // Clear the stored post after viewing
    }
  };

  return (
    <button onClick={handleClick} className="notification-button">
      Notification {hasNewNotification && <span className="dot"></span>}
    </button>
  );
};

export default Notification;
