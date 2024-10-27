// backend/controllers/postController.js
const Post = require('../models/Post');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

exports.createPost = async (req, res) => {
  const { title, codeSnippet, language } = req.body;
  const file = req.file;

  try {
    let codeFileUrl = null;
    let uploadedFileUrl = null;

    // Upload code snippet as a file to MinIO
    if (codeSnippet) {
      const codeFileName = `${uuidv4()}.${language}`;
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

    const post = new Post({
      title,
      language,
      codeFileUrl,
      uploadedFileUrl,
      author: req.userId, // Store the ID of the user who created the post
    });

    await post.save();

    // Emit 'newPost' to notify all users except the one who posted
    const io = req.app.get('io'); // Get io instance
    io.emit('newPost', { post, authorId: req.userId }); // Include authorId to filter notifications

    res.status(201).json(post);
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: error.message });
  }
};
