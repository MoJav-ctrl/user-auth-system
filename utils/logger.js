const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Logger configuration
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});

logger.info('User registered', { email: user.email, ip: req.ip });

// Handle uncaught promise rejections
process.on('unhandledRejection', (reason) => {
    throw reason;
});

module.exports = logger;
