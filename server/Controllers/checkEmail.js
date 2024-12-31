const { StatusCodes } = require("http-status-codes");
const userEmail = require("../Models/UserModel.js");

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const checkMail = await userEmail.findOne({email}).select("-password");

        if(!checkMail){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User not Exist', error: true})
        }

        return res.status(StatusCodes.OK).json({message: 'Email Verify', success: true, data: checkMail})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message, error: true })
    }
}

module.exports = {
    checkEmail
}