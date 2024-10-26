// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  codeFileUrl: { type: String }, // URL for the code snippet file
  uploadedFileUrl: { type: String }, // URL for the user-uploaded file
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
