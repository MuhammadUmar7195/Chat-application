const { StatusCodes } = require("http-status-codes");
const { getUserDetailFormToken } = require("../Helper/getUserDetailFromToken.js");

const userDetails = async (req, res) => {
    try {
        const token = req.cookies.token || "";
        const USER = await getUserDetailFormToken(token);

        if (!USER) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not present', error: true });
        }

        return res.status(StatusCodes.OK).json({ message: 'User Details Fetched Successfully', data: USER });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
};

module.exports = {
    userDetails
};