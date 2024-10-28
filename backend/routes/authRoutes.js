// backend/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController'); // Import register and login functions from authController

const router = express.Router();

// Route to handle user registration
router.post('/register', (req, res) => {
  if (typeof register === 'function') {
    register(req, res);
  } else {
    res.status(500).json({ error: 'Register function is not defined' });
  }
});

// Route to handle user login
router.post('/login', (req, res) => {
  if (typeof login === 'function') {
    login(req, res);
  } else {
    res.status(500).json({ error: 'Login function is not defined' });
  }
});

module.exports = router;
