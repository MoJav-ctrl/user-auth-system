const rateLimit = require('express-rate-limit');

// Rate Limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: "Too many requests!!! Please try again later.",
    skipSuccessfulRequests: true // only failed requests are counted
});

// Rate Limiter for general routes
const generalLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minute
    max: 60, // Limit each IP to 60 requests per windowMs
    message: "Too many requests, please try again later."
});

// Rate limiter for API routes
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

module.exports = {
    authLimiter,
    generalLimiter,
    apiLimiter
};