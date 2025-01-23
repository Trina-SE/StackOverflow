const express = require('express');
const { register, login, getUserById, getAllUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/:userId', getUserById);
// Add the route to get all users
router.get('/users', getAllUsers);

module.exports = router;
