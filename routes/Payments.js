const express = require("express");
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessfullEmail,
} = require("../Controlers/Razorpay");

const {auth, isStudent} = require("../middlewares/auth");

//****************************************************************************************************************** */
//                                              Payment Routes
//****************************************************************************************************************** */

router.post("/capturePayment", auth , isStudent, capturePayment);

router.post("/verifySignature", auth, isStudent,  verifyPayment);

router.post("/sendPaymentSuccessfullEmail", auth, isStudent, sendPaymentSuccessfullEmail)

module.exports = router;