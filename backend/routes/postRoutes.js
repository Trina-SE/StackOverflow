// backend/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController'); // Ensure these functions exist
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('multer')(); // Configure multer for file uploads if needed

const router = express.Router();

// Route to create a post
router.post('/create', authMiddleware, upload.single('file'), createPost); // Correctly use the createPost controller function

// Route to fetch all posts
router.get('/', authMiddleware, getPosts); // Correctly use the getPosts controller function

module.exports = router;