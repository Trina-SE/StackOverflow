const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Try user authentication first
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (userAuthErr) {
    // If user auth fails, try service authentication
    try {
      jwt.verify(token, process.env.INTER_SERVICE_JWT_SECRET);
      return next();
    } catch (serviceAuthErr) {
      console.error("Authentication failed:", serviceAuthErr);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
};