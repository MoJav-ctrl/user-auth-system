const express =require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db'); // Import the connectDB function from the db.js file
require('./config/passport'); // Import the passport configuration function from the passport.js file

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Initialize passport
app.use(passport.initialize());

// Connect to the database
connectDB();

//Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to this User Authentication System');
});

//Export the app for use in other files
module.exports = app;
