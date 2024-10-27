// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Fetch the user's data, including username, to attach to req.user
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // Attach user data to request for later access
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
