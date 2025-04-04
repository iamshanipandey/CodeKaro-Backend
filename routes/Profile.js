const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    removeProfilePicture,
} = require("../Controlers/profile");

const {auth} = require("../middlewares/auth");

//****************************************************************************************************************** */
//                                              Profile Routes
//****************************************************************************************************************** */

router.post("/updateProfile", auth, updateProfile);

router.post("/deleteAccount", auth, deleteAccount);

router.post("/getAllUserDetails", auth, getAllUserDetails);

router.post("/removeProfile", auth, removeProfilePicture);


module.exports = router;
