const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserDetailFormToken = async (token) => {
    if (!token) {
        return {
            message: "Session Expire",
            logout: true
        };
    }

    const decoder = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoder.id).select("-password");
    return user;
};

module.exports = {
    getUserDetailFormToken
};