// backend/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts, getPostById } = require('../controllers/postController'); // Ensure these functions exist and are imported correctly
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('multer')(); // Configure multer for file uploads if needed

const router = express.Router();

// Route to create a post
router.post('/create', authMiddleware, upload.single('file'), createPost); // Correctly use the createPost controller function

// Route to fetch all posts
router.get('/', authMiddleware, getPosts); // Correctly use the getPosts controller function

// Route to get a specific post by ID (for viewing post details)
router.get('/:postId', authMiddleware, getPostById); // Correctly use the getPostById controller function

module.exports = router;
