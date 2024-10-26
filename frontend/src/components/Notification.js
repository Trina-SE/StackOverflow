import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notification = () => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    socket.on('newPost', () => {
      setHasNewNotification(true);
    });
  }, []);

  const handleClick = () => {
    setHasNewNotification(false);
  };

  return (
    <button onClick={handleClick}>
      Notification {hasNewNotification && <span className="dot"></span>}
    </button>
  );
};

export default Notification;
