// src/components/Notification.js
import React from 'react';

const Notification = () => {
  // You will need to manage the notifications state
  const notifications = []; // Replace with your state management logic

  return (
    <div>
      <button>
        Notifications {notifications.length > 0 && <span style={{ color: 'red' }}>●</span>}
      </button>
      {notifications.length > 0 && (
        <div>
          {notifications.map((notif) => (
            <div key={notif.id}>{notif.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
