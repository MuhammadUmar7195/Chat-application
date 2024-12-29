const { StatusCodes } = require("http-status-codes");

const notFound = async (req, res) => {
    // res.status(404).json({msg: "Page not Found"})
    res.status(StatusCodes.NOT_FOUND).send(`<center>Route Does not Exists</center>`);
}

module.exports = notFound;
