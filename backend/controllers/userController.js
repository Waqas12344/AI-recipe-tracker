 import User from "../models/User.js"; 
 import UserPreference from "../models/UserPreference.js";


// Get user profile 

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const preferences = await UserPreference.findByUserId(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: { 
                user,
                preferences
            },
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ message: "Server error" });
        next(error);
    }   
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        
        const user = await User.updateById(req.user.id, { name, email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: { user },
        });
    } catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ message: "Server error" });
        next(error);
    }
};

// update user preference 
export const updateUserPreference = async (req, res, next) => {
    try {
        const preferences = await UserPreference.upsert(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "User preferences updated successfully",
            data: { preferences },
        });
    } catch (error) {
        console.error("Update user preferences error:", error);
        res.status(500).json({ message: "Server error" });
        next(error);
    }
};

// password reset request 

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
         if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new passwords are required" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isValid = await User.verifyPassword(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        await User.updatePassword(req.user.id, newPassword);
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error" });
        next(error);
    }
};

// delete user account
export const deleteUserAccount = async (req, res, next) => {
    try {   
        await User.delete(req.user.id);
        res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });
    } catch (error) {
        console.error("Delete user account error:", error);
        res.status(500).json({ message: "Server error" });
        next(error);
    }
};
