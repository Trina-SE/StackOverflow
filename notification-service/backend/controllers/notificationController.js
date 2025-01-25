const Notification = require('../models/Notification');
const axios = require('axios');
const jwt = require('jsonwebtoken');

function generateServiceToken() {
  return jwt.sign(
    { service: 'notification-service' },
    process.env.INTER_SERVICE_JWT_SECRET,
    { expiresIn: '1h' }
  );
}

async function fetchPostDetails(postId) {
  const serviceToken = generateServiceToken();
  try {
    const response = await axios.get(`${process.env.POST_SERVICE_URL}/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${serviceToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching post details:', error.message);
    return null;
  }
}

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId, read: false });
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const post = await fetchPostDetails(notification.postId);
        return { ...notification._doc, post };
      })
    );

    res.json(enrichedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

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
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

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
    console.error('Error creating notifications:', error.message);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
};

