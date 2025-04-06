// server.js

// 1. Import required packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


// 2. Load environment variables from .env file
dotenv.config();

// 3. Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const eventRoutes = require('./routes/eventRoutes');


// 4. Create an Express app
const app = express();

// 5. Middlewares
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse incoming JSON data

// 6. Route middlewares
app.use('/api/auth', authRoutes);   // For authentication (register/login)
app.use('/api/tasks', taskRoutes);  // For task management
app.use('/api/events', eventRoutes);


// 7. Connect to MongoDB and start the server
connectDB();  // <-- call the database connection

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

