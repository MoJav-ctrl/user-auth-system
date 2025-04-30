const { ApiError } = require('../utils/errorHandler');
const User = require('../models/userModel');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(new ApiError(500, 'Server error'));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return next(new ApiError(400, 'Invalid updates'));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json({
      success: true,
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

module.exports = {
  getProfile,
  updateProfile
};

