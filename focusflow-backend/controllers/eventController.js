// controllers/eventController.js

const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  const { title, description, start, end } = req.body;

  try {
    const event = await Event.create({
      userId: req.user,
      title,
      description,
      start,
      end
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user }).sort({ start: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
