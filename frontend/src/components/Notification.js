// src/components/Notification.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost');

const Notification = ({ onNotificationClick }) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    socket.on('newPostNotification', (data) => {
      setHasNewNotification(true); // Show red dot for new posts
    });

    return () => {
      socket.off('newPostNotification');
    };
  }, []);

  const handleClick = () => {
    setHasNewNotification(false);
    onNotificationClick();
  };

  return (
    <button onClick={handleClick} className="notification-button">
      Notification {hasNewNotification && <span className="dot"></span>}
    </button>
  );
};

export default Notification;