const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage(); // Use memory storage for this example; adjust as needed

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf|cpp|py|java|txt/; // Add or modify file types as needed
        const extname = filetypes.test(file.mimetype) || filetypes.test(file.originalname.split('.').pop());
        if (extname) {
            return cb(null, true);
        }
        cb('Error: File type not allowed!');
    }
});

module.exports = upload;
