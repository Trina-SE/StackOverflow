// backend/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

// Function to create a new post
exports.createPost = async (req, res) => {
  const { title, codeSnippet, language } = req.body;
  const file = req.file;

  try {
    let codeFileUrl = null;
    let uploadedFileUrl = null;

    // Upload code snippet as a file to MinIO
    if (codeSnippet) {
      const codeFileName = `${uuidv4()}.${language || 'txt'}`;
      await minioClient.putObject(
        process.env.MINIO_BUCKET,
        codeFileName,
        Buffer.from(codeSnippet),
        { 'Content-Type': 'text/plain' }
      );
      codeFileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${codeFileName}`;
    }

    // Upload user-uploaded file to MinIO
    if (file) {
      const uploadedFileName = `${uuidv4()}_${file.originalname}`;
      await minioClient.putObject(
        process.env.MINIO_BUCKET,
        uploadedFileName,
        file.buffer
      );
      uploadedFileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${uploadedFileName}`;
    }

    // Get author information
    const author = await User.findById(req.userId).select('username');
    if (!author) {
      return res.status(400).json({ error: 'Author not found' });
    }

    // Create new post
    const post = new Post({
      title,
      language: language || null,
      codeFileUrl,
      uploadedFileUrl,
      author: req.userId,
    });
    await post.save();

    // Notify other users
    const otherUsers = await User.find({ _id: { $ne: req.userId } });
    const notifications = otherUsers.map((user) => ({
      userId: user._id,
      postId: post._id,
      read: false,
    }));
    await Notification.insertMany(notifications);

    // Emit notification to clients
    const io = req.app.get('io');
    io.emit('newPostNotification', {
      postId: post._id,
      title: post.title,
      authorUsername: author.username,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username'); // Populate author to show the username in the post
    res.json(posts);
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId, read: false })
      .populate('postId', 'title author')
      .populate('userId', 'username')
      .exec();
    res.json(notifications);
  } catch (error) {
    console.error("Error in getUnreadNotifications:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to mark notifications as read
exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error("Error in markNotificationsAsRead:", error);
    res.status(500).json({ error: error.message });
  }
};