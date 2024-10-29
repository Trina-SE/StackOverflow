// backend/config/minio.js
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT, // No need for extra adjustments here
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false, // Set to true if using HTTPS
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

// Ensure the bucket exists or create it
const bucketName = process.env.MINIO_BUCKET;
const ensureBucketExists = async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket "${bucketName}" created successfully.`);
    } else {
      console.log(`Bucket "${bucketName}" already exists.`);
    }
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
  }
};

ensureBucketExists();

module.exports = minioClient;