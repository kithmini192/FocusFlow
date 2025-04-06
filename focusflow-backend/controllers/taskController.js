// controllers/taskController.js

const Task = require('../models/Task');

// @desc    Create a new Task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  const { taskName } = req.body;

  try {
    const task = await Task.create({
      userId: req.user,
      taskName
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a session to a Task
// @route   POST /api/tasks/session
// @access  Private
exports.addSession = async (req, res) => {
  const { taskId, startTime, endTime, duration } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Push new session into the task
    task.sessions.push({ startTime, endTime, duration });

    await task.save();

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Productivity Report for the past 7 days
// @route   GET /api/tasks/report
// @access  Private
exports.getProductivityReport = async (req, res) => {
    try {
      // Get today's date
      const today = new Date();
      
      // 7 days ago
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
  
      // Find all tasks for the user
      const tasks = await Task.find({ userId: req.user });
  
      let totalSessions = 0;
      let totalMinutes = 0;
      const taskBreakdown = {};
  
      // Calculate totals
      tasks.forEach(task => {
        task.sessions.forEach(session => {
          if (new Date(session.startTime) >= lastWeek) {
            totalSessions += 1;
            totalMinutes += session.duration;
  
            if (!taskBreakdown[task.taskName]) {
              taskBreakdown[task.taskName] = { sessions: 0, minutes: 0 };
            }
            taskBreakdown[task.taskName].sessions += 1;
            taskBreakdown[task.taskName].minutes += session.duration;
          }
        });
      });
  
      res.json({
        totalSessions,
        totalMinutes,
        taskBreakdown
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // @desc    Get Monthly Productivity Report
// @route   GET /api/tasks/monthly-report
// @access  Private
exports.getMonthlyProductivityReport = async (req, res) => {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
      // Find all tasks for the user
      const tasks = await Task.find({ userId: req.user });
  
      let totalSessions = 0;
      let totalMinutes = 0;
      const taskBreakdown = {};
  
      // Loop through tasks and sessions
      tasks.forEach(task => {
        task.sessions.forEach(session => {
          const sessionStart = new Date(session.startTime);
          if (sessionStart >= firstDayOfMonth && sessionStart <= lastDayOfMonth) {
            totalSessions += 1;
            totalMinutes += session.duration;
  
            if (!taskBreakdown[task.taskName]) {
              taskBreakdown[task.taskName] = { sessions: 0, minutes: 0 };
            }
            taskBreakdown[task.taskName].sessions += 1;
            taskBreakdown[task.taskName].minutes += session.duration;
          }
        });
      });
  
      res.json({
        month: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
        totalSessions,
        totalMinutes,
        taskBreakdown
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  