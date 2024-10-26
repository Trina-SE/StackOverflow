const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9001,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
});

const bucketName = 'stack';

// Ensure bucket exists
minioClient.bucketExists(bucketName, (err) => {
    if (err) {
        minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
            if (err) return console.log('Error creating bucket.', err);
            console.log('Bucket created successfully.');
        });
    }
});

module.exports = minioClient;
