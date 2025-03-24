const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // removes whitespace
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
}, {
     timestamps: true // adds createdAt and updatedAt timestamps
});

// Pre-save hook to hash the password before saving the user
UserSchema.pre('save', async function(next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // hash the password
  }
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create a model
const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;
