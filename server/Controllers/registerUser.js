const userModel = require("../Models/UserModel");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const registrationUser = async (req, res) => {
    try {
        const { name, email, password, profile_pic } = req.body;

        const checkEmail = await userModel.findOne({ email });
        if (checkEmail) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "User already exists", error: true });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const payload = {
            name,
            email,
            profile_pic,
            password: hashPassword,
        };

        const user = new userModel(payload);
        const saveUser = await user.save();

        return res
            .status(StatusCodes.CREATED)
            .json({ message: "User is created successfully", data: saveUser, success: true });

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
};

module.exports = {
    registrationUser,
};
