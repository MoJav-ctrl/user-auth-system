const passport = require('passport');
const { ApiError } = require('../utils/errorHandler');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const User = require('../models/userModel');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

const login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return next(new ApiError(401, info?.message || 'Login failed'));
    }

    req.login(user, { session: false }, async (err) => {
      if (err) return next(err);

      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    });
  })(req, res, next);
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return next(new ApiError(404, 'No account with that email found'));
    }

    user.generatePasswordReset();
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, user.resetPasswordToken);

    res.json({
      success: true,
      message: 'Password reset link sent to email'
    });
  } catch (err) {
    next(new ApiError(500, 'Error sending email'));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = verifyToken(token);
    const user = await User.findOne({
      _id: decoded.sub,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ApiError(400, 'Password reset token is invalid or has expired'));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset'
    });
  } catch (err) {
    next(new ApiError(400, 'Invalid token'));
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};

