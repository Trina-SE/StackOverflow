const Notification = require('../models/Notification');
const axios = require('axios');

// Function to get unread notifications
exports.getUnreadNotifications = async (req, res) => {
  try {
    // Fetch notifications from the database
    const notifications = await Notification.find({ userId: req.userId, read: false });

    // Enrich notifications by calling `post-service` to fetch post and author details
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        try {
          const postServiceUrl = `${process.env.POST_SERVICE_URL}/api/posts/${notification.postId}`;
          const { data: post } = await axios.get(postServiceUrl);

          return {
            ...notification._doc,
            post, // Include post details
          };
        } catch (error) {
          console.error(`Error fetching post details for postId: ${notification.postId}`, error);
          return notification; // Fallback to the original notification if post fetch fails
        }
      })
    );

    res.json(enrichedNotifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

// Function to mark a notification as read
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

// Function to create notifications for new posts
exports.createNotifications = async (req, res) => {
  const { postId, authorUsername } = req.body;

  try {
    const userServiceUrl = `${process.env.USER_SERVICE_URL}/api/auth/users`;
    const { data: users } = await axios.get(userServiceUrl);

    const notifications = users
      .filter((user) => user.username !== authorUsername)
      .map((user) => ({
        userId: user._id,
        postId,
        read: false,
      }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: 'Notifications created successfully' });
  } catch (error) {
    console.error("Error creating notifications:", error.message);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
};