// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: false }, // Confirm this is set to false
  codeFileUrl: { type: String },
  uploadedFileUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
