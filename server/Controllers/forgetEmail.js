const UserModel = require("../Models/UserModel.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User does not exist", error: true });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Use your email provider's SMTP details
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD // Your email password
            }
        });

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h3>Password Reset Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_blank">${resetLink}</a>
                <p>This link is valid for 15 minutes.</p>
            `
        });

        return res.status(StatusCodes.OK).json({ message: "Password reset email sent", success: true });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error: true });
    }
};
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired token", error: true });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(StatusCodes.OK).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error: true });
    }
};

module.exports = {
    forgetPassword,
    resetPassword
};
