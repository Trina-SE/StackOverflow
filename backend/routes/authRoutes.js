// backend/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController'); // Make sure these functions are correctly imported
const router = express.Router();

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

module.exports = router;
