const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT.split(':')[0], // Extract host
    port: parseInt(process.env.MINIO_ENDPOINT.split(':')[1]), // Extract port
    useSSL: false, // Set to true if using SSL
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// Ensure bucket exists
const bucketName = process.env.BUCKET_NAME;
minioClient.bucketExists(bucketName, function(err) {
    if (err) {
        if (err.code === 'NoSuchBucket') {
            minioClient.makeBucket(bucketName, '', function(err) {
                if (err) {
                    return console.log('Error creating bucket.', err);
                }
                console.log(`Bucket ${bucketName} created successfully.`);
            });
        } else {
            console.log('Error checking bucket:', err);
        }
    } else {
        console.log(`Bucket ${bucketName} already exists.`);
    }
});

module.exports = minioClient;
