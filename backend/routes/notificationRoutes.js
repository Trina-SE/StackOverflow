// backend/routes/notificationRoutes.js
const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get unseen notifications for a user
router.get('/unseen', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId,
      seen: false,
    }).populate('postId', 'title');

    res.json(notifications);
  } catch (error) {
    console.error("Error in fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark notifications as seen
router.put('/mark-seen', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, seen: false }, { seen: true });
    res.json({ message: 'Notifications marked as seen' });
  } catch (error) {
    console.error("Error in marking notifications:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
