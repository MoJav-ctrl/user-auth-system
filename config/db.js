const mongoose = require('mongoose');
require('dotenv');

const connectDB = async () => {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(process.env.DATABASE_URI); 
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    };

    module.exports = connectDB;
