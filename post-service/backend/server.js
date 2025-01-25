require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Minio = require('minio');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ], // Allowed methods
  credentials: true, // Allow credentials (if needed)
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Post Service: MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MinIO client setup

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

// Ensure MinIO bucket exists
const bucketName = process.env.MINIO_BUCKET || 'stack';

minioClient.bucketExists(bucketName, (err, exists) => {
  if (err) {
    console.error('Error checking bucket:', err);
    return;
  }
  if (!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
      if (err) {
        console.error('Error creating bucket:', err);
      } else {
        console.log(`Bucket ${bucketName} created successfully`);
      }
    });
  } else {
    console.log(`Bucket ${bucketName} already exists`);
  }
});

// Routes
app.use('/api/posts', require('./routes/postRoutes'));

// Start the server
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
