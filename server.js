const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

// Start the server
const PORT = config.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URI', 'EMAIL_USERNAME'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) throw new Error(`Missing ${varName} in environment`);
});

module.exports = server;