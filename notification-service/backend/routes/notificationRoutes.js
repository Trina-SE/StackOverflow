const express = require('express');
const {
  getUnreadNotifications,
  markNotificationAsRead,
  createNotifications,
} = require('../controllers/notificationController');
const authMiddleware = require('../config/authMiddleware');

const router = express.Router();

// Route to get unread notifications
router.get('/unread', authMiddleware, getUnreadNotifications);

// Route to mark a notification as read
router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);

// Route to create notifications for a new post
router.post('/notify', createNotifications);

module.exports = router;
