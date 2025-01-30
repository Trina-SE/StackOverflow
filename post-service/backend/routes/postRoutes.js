const express = require('express');
const { createPost, getPosts, getPostById } = require('../controllers/postController');
const authMiddleware = require('../config/authMiddleware');
const upload = require('multer')(); // For file uploads

const router = express.Router();

// Route to create a post
router.post('/create', authMiddleware, upload.single('file'), createPost);

// Route to fetch all posts
router.get('/', authMiddleware, getPosts);

// Route to get a specific post by ID
router.get('/:postId', authMiddleware, getPostById);

module.exports = router;
