const { StatusCodes } = require("http-status-codes");
const userPassword = require("../Models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkPassword = async (req, res) => {
    try {
        const { password, userId } = req.body;

        const checkPassword = await userPassword.findById(userId);
        if (!checkPassword) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'User not found', error: true });
        }

        const verifyPassword = await bcrypt.compare(password, checkPassword.password);
        if (!verifyPassword) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Check your password', error: true });
        }

        const tokenData = {
            id: checkPassword._id,
            email: checkPassword.email,
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
            expiresIn: '5d',
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        return res
            .cookie("token", token, cookieOptions)
            .status(StatusCodes.OK)
            .json({ message: 'Login successfully', success: true, token });
    } catch (error) {
        console.error(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
};

module.exports = {
    checkPassword
}