const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/jwt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = jwt.sign(
    { sub: this._id },
    jwtSecret,
    { expiresIn: '1h' }
  );
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

module.exports = mongoose.model('User', userSchema);

