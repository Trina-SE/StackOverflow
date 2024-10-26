// controllers/postController.js

const Post = require('../models/Post'); // Import the Post model
const minioClient = require('../config/minio'); // Import the MinIO client

const createPost = async (req, res) => {
    try {
        const { title, language, codeSnippet } = req.body; // Get data from request body
        const file = req.file; // Get the uploaded file

        if (!file) {
            return res.status(400).json({ message: 'File is required' });
        }

        // Validate required fields
        if (!title || !language || !codeSnippet) {
            return res.status(400).json({ message: 'Title, language, and code snippet are required' });
        }

        // Generate a unique file name for the uploaded file
        const fileName = `${Date.now()}_${file.originalname}`;
        console.log(`Uploading file to MinIO: ${fileName}`);

        // Upload the file to MinIO
        await minioClient.putObject(process.env.BUCKET_NAME, fileName, file.buffer, file.size);
        console.log(`File uploaded to MinIO: ${fileName}`);

        // Create a new post entry
        const newPost = new Post({
            title,
            language,
            codeSnippet,
            fileName, // Save the file name
        });

        // Save the post to MongoDB
        await newPost.save();
        console.log('Post saved to MongoDB:', newPost);

        // Send a response back to the client
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createPost };
