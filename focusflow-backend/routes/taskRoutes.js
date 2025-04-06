// routes/taskRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // 🛑 make sure you import protect!
const { createTask, getTasks, addSession, getProductivityReport, getMonthlyProductivityReport } = require('../controllers/taskController');

const router = express.Router();

// Protected routes
router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.post('/session', protect, addSession);
router.get('/report', protect, getProductivityReport);
router.get('/monthly-report', protect, getMonthlyProductivityReport);


module.exports = router;
