const express = require('express');
const { createPost } = require('../controllers/postController');
//const authMiddleware = require('../../user-service/backend/config/authMiddleware');
const authMiddleware = require('../config/authMiddleware');
const upload = require('multer')();

const router = express.Router();

router.post('/create', authMiddleware, upload.single('file'), createPost);

module.exports = router;
