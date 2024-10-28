// backend/routes/notificationRoutes.js
const express = require('express');
const { getUnreadNotifications, markNotificationAsRead } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get unread notifications
router.get('/unread', authMiddleware, getUnreadNotifications);

// Route to mark a notification as read
router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);

module.exports = router;
