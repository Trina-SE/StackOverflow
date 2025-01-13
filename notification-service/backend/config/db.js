const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Notification Service: MongoDB connected");
  } catch (error) {
    console.error("Notification Service: MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
