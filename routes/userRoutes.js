const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authentication');
const { generalLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all routes
router.use(authenticateJWT);

// Apply general rate limiting to all user routes
router.use(generalLimiter);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile
router.put('/profile', userController.updateProfile);

// DELETE /api/users/profile
router.delete('/profile', userController.deleteAccount);

module.exports = router;