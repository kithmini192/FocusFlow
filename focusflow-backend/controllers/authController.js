// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
  
      // Check if user already exists
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(409).json({ message: 'Email already registered. Please login.' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the user
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword
      });
  
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const user = await User.findById(req.user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update username and email
      if (username) user.username = username;
      if (email) user.email = email;
  
      // If password is provided, hash it and update
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
  
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  