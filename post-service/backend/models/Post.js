const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String },
  codeFileUrl: { type: String },
  uploadedFileUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  // authorUsername: { type: String, required: true }, // Include author's username
});

module.exports = mongoose.model('Post', postSchema);
