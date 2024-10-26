const express = require('express');
const { createPost } = require('../controllers/postController');
const upload = require('../middleware/multerFile');  // Update this line

const router = express.Router();

// This endpoint expects a file input with the name 'file'
router.post('/create', upload.single('file'), createPost);

module.exports = router;
