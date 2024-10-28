// backend/controllers/notificationController.js
const Notification = require('../models/Notification');

// Existing function to get unread notifications
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId, read: false })
      .populate({
        path: 'postId',
        populate: {
          path: 'author',
          select: 'username',
        },
      });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

// New function to mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: 'Server error marking notification as read' });
  }
};
