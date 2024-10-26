// backend/routes/postRoutes.js
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController'); // Ensure these are imported correctly
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('multer')();

const router = express.Router();

// Route to create a post
router.post('/create', authMiddleware, upload.single('file'), createPost);

// Route to fetch all posts
router.get('/', authMiddleware, getPosts);

module.exports = router;
