const { StatusCodes } = require("http-status-codes");

const logout = async (req, res) => {
    try {
        const cookieOptions = {
            http: true,
            secure: true
        }

        return res.cookie("token", "", cookieOptions).status(StatusCodes.OK).json({ logout: 'Session out', success: true});

    } catch (error) {
        return res
            .status(StatusCodesdes.INTERNAL_SERVER_ERROR)
            .json({ message: error.message, error: true });
    }
}

module.exports = {
    logout
}