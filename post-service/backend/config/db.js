const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Post Service: MongoDB connected");
  } catch (error) {
    console.error("Post Service: MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
