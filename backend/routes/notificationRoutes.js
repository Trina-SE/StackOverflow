// backend/routes/notificationRoutes.js
const express = require('express');
const { getUnreadNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get unread notifications for a user
router.get('/unread', authMiddleware, getUnreadNotifications);

module.exports = router;
