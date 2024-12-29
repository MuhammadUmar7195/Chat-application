const express = require("express");
const router = express.Router();
const { registrationUser } = require("../Controllers/registerUser.js");
const { checkEmail } = require("../Controllers/checkEmail.js");
const { checkPassword } = require("../Controllers/checkPassword.js");
const { userDetails } = require("../Controllers/userDetails.js");
const { logout } = require("../Controllers/logout.js");
const { updateUser } = require("../Controllers/updateUser.js");
const { searchUser } = require("../Controllers/searchUser.js");

// For Register new Users
router.post("/register", registrationUser);
//Email authentication
router.post("/email", checkEmail);
//password authentication
router.post("/password", checkPassword);
//User Details
router.get("/user-details", userDetails);
// Logout Session token 
router.get("/logout", logout);
//Update the USer
router.post("/update-user", updateUser);
//Search User Query 
router.post("/search-user", searchUser);


module.exports = router;
