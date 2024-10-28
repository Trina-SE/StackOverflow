// backend/controllers/notificationController.js
const Notification = require('../models/Notification');

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId, read: false });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};