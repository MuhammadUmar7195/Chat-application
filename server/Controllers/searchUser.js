const { StatusCodes } = require("http-status-codes");
const UserModel = require("../Models/UserModel");

const searchUser = async (req, res) => {
    try {
        const { search } = req.body;

        const query = new RegExp(search, "i");

        const searchInformation = await UserModel.find({
            "$or": [
                {
                    name: query,
                    email: query
                }
            ]
        });

        if (searchInformation.length === 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "User not Found", error: true });
        }

        return res.status(StatusCodes.OK).json({ message: "Search Completed..", data: searchInformation, success: true });

    } catch (error) {
        console.error("Error Search User", error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
};

module.exports = { searchUser };