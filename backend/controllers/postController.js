const Post = require('../models/Post');
const minioClient = require('../config/minio');

exports.createPost = async (req, res) => {
    const { title, language, codeSnippet } = req.body;
    const file = req.file; // Get the file from the request

    if (!file) {
        return res.status(400).json({ message: 'File is required' });
    }

    const fileExtension = file.mimetype === 'text/x-c' ? '.c' : file.mimetype === 'text/x-c++' ? '.cpp' : file.mimetype === 'text/x-python' ? '.py' : '.java';
    const fileName = `${Date.now()}${fileExtension}`;

    try {
        // Upload the file to MinIO
        await minioClient.putObject('stack', fileName, file.buffer, file.size);
        
        // Save post to MongoDB
        const newPost = new Post({
            title,
            language,
            codeSnippet,
            fileUrl: `http://127.0.0.1:9000/stack/${fileName}`, // URL to access the file
            createdAt: new Date(),
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
};
