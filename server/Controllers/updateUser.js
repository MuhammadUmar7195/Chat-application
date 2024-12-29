const { getUserDetailFormToken } = require("../Helper/getUserDetailFromToken.js");
const userModel = require("../Models/UserModel.js");
const { StatusCodes } = require("http-status-codes");

const updateUser = async (req, res) => {
    try {
        const token = req.cookies.token || "";
        const user = await getUserDetailFormToken(token);

        if (!user) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Invalid token", error: true });
        }

        const { name, profile_pic } = req.body;

        if (!name && !profile_pic) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Name or profile picture is required", error: true });
        }

        await userModel.updateOne({ _id: user._id }, {
            name,
            profile_pic,
        });

        const userInformation = await userModel.findById(user._id);

        return res.status(StatusCodes.OK).json({
            message: "User updated successfully",
            data: userInformation,
            success: true,
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
};

module.exports = { updateUser };
