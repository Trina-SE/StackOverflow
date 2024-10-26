const multer = require('multer');

// Configure storage for uploaded files
const storage = multer.memoryStorage(); // Store files in memory

// Create multer instance
const upload = multer({ storage: storage });

// Export the multer instance
module.exports = upload;
