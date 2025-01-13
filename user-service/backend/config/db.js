const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("User Service: MongoDB connected");
  } catch (error) {
    console.error("User Service: MongoDB connection failed:", error.message);
  }
};

module.exports = connectDB;
