const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify using inter-service JWT secret
    const decoded = jwt.verify(token, process.env.INTER_SERVICE_JWT_SECRET);
    
    // If it's a service token, allow access
    if (decoded.service) {
      return next();
    }

    // Regular user token verification
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};