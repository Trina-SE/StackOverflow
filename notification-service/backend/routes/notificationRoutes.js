const express = require('express');
const { getUnreadNotifications } = require('../controllers/notificationController');
//const authMiddleware = require('../../user-service/backend/config/authMiddleware');
const authMiddleware = require('../config/authMiddleware');

const router = express.Router();

router.get('/unread', authMiddleware, getUnreadNotifications);

module.exports = router;
