// backend/controllers/postController.js
const Post = require('../models/Post');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

// Function to create a new post
exports.createPost = async (req, res) => {
  const { title, codeSnippet, language } = req.body;
  const { file } = req;

  try {
    let fileUrl = null;
    if (file) {
      const fileName = `${uuidv4()}.${language}`;
      await minioClient.putObject(process.env.MINIO_BUCKET, fileName, file.buffer);
      fileUrl = fileName;
    }

    const post = new Post({
      title,
      codeSnippet,
      language,
      fileUrl,
      author: req.userId,
    });

    await post.save();
    res.status(201).json(post);
    req.app.get('io').emit('newPost', post); // Optional notification
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: error.message });
  }
};

// Function to get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
