const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authLimiter, resetLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/signup
router.post('/signup',
  authLimiter,
  validateRegister,
  authController.signup
);

// POST /api/auth/login
router.post('/login',
  authLimiter,
  validateLogin,
  authController.login
);

// POST /api/auth/reset-password (request reset link)
router.post('/reset-password',
  resetLimiter,
  authController.requestPasswordReset
);

// PUT /api/auth/reset-password/:token (confirm password reset)
router.put('/reset-password/:token',
  resetLimiter,
  authController.confirmPasswordReset
);

module.exports = router;