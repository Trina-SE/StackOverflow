const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registration Controller
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create and save the new user
    user = new User({
      username,
      email,
      password, // Directly save the password in string format as requested
    });
    await user.save();

    // Generate a token to log the user in immediately
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
