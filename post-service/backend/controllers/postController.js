//frontend/post-service/backend/controllers/postController.js
const Post = require('../models/Post');
const axios = require('axios'); // For inter-service communication
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');
const streamToString = require('stream-to-string');

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

    // Communicate with `user-service` to fetch author details
    const userServiceUrl = `${process.env.USER_SERVICE_URL}/api/auth/user/${req.userId}`;
    const { data: author } = await axios.get(userServiceUrl);

    if (!author) {
      return res.status(400).json({ error: 'Author not found' });
    }
    console.log("Received userId from request:", req.userId);
    // Create new post
    const post = new Post({
      title,
      language: language || null,
      codeFileUrl,
      uploadedFileUrl,
      author: req.userId,
      authorUsername: author.username,
    });
    await post.save();

    console.log("Created post:", post);

    // Communicate with `notification-service` to notify users
    const notificationServiceUrl = `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/notify`;
    await axios.post(notificationServiceUrl, {
      postId: post._id,
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
    const posts = await Post.find().sort({ createdAt: -1 });
    
    // Map to ensure authorUsername is directly on the post object
    const postsWithAuthors = posts.map(post => ({
      ...post.toObject(),
      author: {
        username: post.authorUsername // Use the stored authorUsername
      }
    }));

    res.json(postsWithAuthors);
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get a specific post by ID, including file content from MinIO
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  if (!postId || postId === 'undefined') {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch author details
    let authorUsername = 'Unknown';
    try {
      const userServiceUrl = `${process.env.USER_SERVICE_URL}/api/auth/user/${post.author}`;
      const { data: author } = await axios.get(userServiceUrl);
      authorUsername = author.username;
    } catch (authorError) {
      console.error(`Error fetching author for post ${postId}:`, authorError);
    }

    // Rest of your existing code for file retrieval...
    let codeContent = null;
    let uploadedFileContent = null;

    // Add error handling for file retrievals
    try {
      if (post.codeFileUrl) {
        const codeFileName = post.codeFileUrl.split('/').pop();
        const codeFileStream = await minioClient.getObject(process.env.MINIO_BUCKET, codeFileName);
        codeContent = await streamToString(codeFileStream);
      }
    } catch (fileError) {
      console.error('Error retrieving code file:', fileError);
    }

    try {
      if (post.uploadedFileUrl) {
        const uploadedFileName = post.uploadedFileUrl.split('/').pop();
        const uploadedFileStream = await minioClient.getObject(process.env.MINIO_BUCKET, uploadedFileName);
        uploadedFileContent = await streamToString(uploadedFileStream);
      }
    } catch (fileError) {
      console.error('Error retrieving uploaded file:', fileError);
    }

    res.json({
      post: {
        ...post.toObject(),
        authorUsername
      },
      codeContent,
      uploadedFileContent,
    });
  } catch (error) {
    console.error("Error in getPostById:", error);
    res.status(500).json({ error: error.message });
  }
};