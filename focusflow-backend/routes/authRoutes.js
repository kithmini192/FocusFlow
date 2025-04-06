// routes/authRoutes.js

const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', protect, updateProfile);


module.exports = router;
