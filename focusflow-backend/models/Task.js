// models/Task.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,  // Duration in minutes
    required: true,
  }
});

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',     // Reference to User model
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  sessions: [sessionSchema] // Array of sessions
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
