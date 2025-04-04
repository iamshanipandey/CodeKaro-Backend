const express = require("express");
const router = express.Router();


const {
        logIn, 
        signUp, 
        sendOTP, 
        changePassword
    } = require("../Controlers/authPage");

const {
    resetPasswordLink,
    resetPassword,
} = require("../Controlers/resetPassword");

const {auth} = require("../middlewares/auth");

//****************************************************************************************************************** */
//                                              Authentication Routes
//****************************************************************************************************************** */

// Routes for logIn
router.post("/auth/login",logIn);

// Routes for SignUp
router.post("/auth/signup", signUp);

// Routes for Sending OTP to the email
router.post("/auth/sentotp", sendOTP);

// Routes for changePassword
router.post("/user/change-password",auth, changePassword);


//****************************************************************************************************************** */
//                                              Reset Password Routes
//****************************************************************************************************************** */

// Route for generating a reset password token
router.post("/auth/reset-password-link", resetPasswordLink);

// Router for reseting user password after verification
router.post("/auth/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router;