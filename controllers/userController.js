const userModel = require('../models/userModel');

// Get user profile
const getProfile = async (req, res) => {
    try {
        // Exclude sensitive information from the response
        const user = await userModel.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching profile' 
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['email']; // Fields that can be updated
        const isValidOperation = Object.keys(updates).every(field => allowedUpdates.includes(field));

        if (!isValidOperation) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid updates' 
            });
        }

        // Check if email is being updated and if it's already taken
        if (updates.email) {
            const existingUser = await userModel.findOne({ email: updates.email });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already in use' 
                });
            }
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while updating profile' 
        });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while deleting account' 
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    deleteAccount
};
