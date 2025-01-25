const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String },
  codeFileUrl: { type: String },
  uploadedFileUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorUsername: { type: String, required: true }, // Add this back
  createdAt: { type: Date, default: Date.now },
  },

);

module.exports = mongoose.model('Post', postSchema);
