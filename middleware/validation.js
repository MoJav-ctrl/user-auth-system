const { check, validationResult } = require('express-validator');
const { ApiError } = require('../utils/errorHandler');

const validateSignup = [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
  check('name').not().isEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation error', errors.array()));
    }
    next();
  }
];

const validateLogin = [
  check('email').isEmail().normalizeEmail(),
  check('password').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, 'Validation error', errors.array()));
    }
    next();
  }
];

module.exports = {
  validateSignup,
  validateLogin
};

