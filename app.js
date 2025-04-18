const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// General rate limiting middleware
app.use(generalLimiter);

// Application-level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication
app.use(passport.initialize());

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});


module.exports = app;

