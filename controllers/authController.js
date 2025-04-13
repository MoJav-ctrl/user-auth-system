const userModel = require('../models/userModel');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/email');

// User signup
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already in use' 
            });
        }

        // Create new user
        const newUser = new userModel({ email, password });
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during signup' 
        });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Security: Artificial delay setup
        const user = await userModel.findOne({ email });
        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Anti-timing attack
            return res.status(202).json({
                success: true,
                message: 'If this email is registered, you will receive a password reset link shortly'
            });
        }

        // Generate and save token
        const resetToken = uuidv4();
        user.resetPasswordToken = await bcrypt.hash(resetToken, 10); // Hashed token
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Send email
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: `Reset link: ${resetUrl} (expires in 1 hour)`
        });

        return res.status(202).json({
            success: true,
            message: 'If this email is registered, you will receive a password reset link shortly'
        });
        
    } catch (error) {
        console.error('Reset error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset' 
        });
    }
};

// Confirm password reset (no changes needed here)
const confirmPasswordReset = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user by reset token
        const user = await userModel.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        // Update password and clear reset token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Confirmation',
            text: 'Your password has been successfully reset.'
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Password reset successful' 
        });
    } catch (error) {
        console.error('Password reset confirmation error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during password reset' 
        });
    }
};

module.exports = {
    signup,
    login,
    requestPasswordReset,
    confirmPasswordReset
};


