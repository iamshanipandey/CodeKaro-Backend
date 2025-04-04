const Profile = require("../models/Profile");
const User = require("../models/Users");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


exports.updateProfile = async (req, res) =>{
    try
    {
        //get data
        const {dateOfBirth="", about="", contactNumber="", gender="", profession="", firstName="", lastName="", profilePictureURL} = req.body;
        
        
        // get id
        const id = req.user.id;
       
        // validate
        if(!contactNumber || !gender || !profession || !firstName || !lastName)
        {
            return res.status(401).json({
                success: false,
                message: "All Fields are required"
            })
        }
       
        // find profile
        const user = await User.findById(id);
        
        const profileId = user.additionalDetails;
        const profileDetails = await Profile.findById(profileId);       


        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        console.log(profileDetails.profession);
        profileDetails.profession = profession;
        await profileDetails.save();


        // update userProfile Picture
        if(!profilePictureURL)
        {
            const profilePicture = req.files.profilePicture;
            const uploadPicture = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);
            user.profilePicture = uploadPicture.secure_url;
        }
        
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            userDetails,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to update Profile, Please try again",
        })
    }
}

exports.removeProfilePicture = async (req, res) =>{
   
    try
    {
        const id = req.user.id;

        const user = await User.findById(id).populate("additionalDetails");
        

        user.profilePicture = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Removed",
            user
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to Remove Profile",
            
        })
    }
}

// DeleteAccount
// TASK: Schedule delete account work , so that account not deleted immediatly.
exports.deleteAccount = async (req,res) =>{
    try
    {
        // get id
        const id = req.user.id;

        // validate
        const userDetails = await User.findById(id);
        if(!userDetails)
        {
            return res.status(401).json({
                success: false,
                message: "User not found",
            })
        }

        // delete profile
        const userProfile = userDetails.additionalDetails;
        await Profile.findByIdAndDelete({_id:userProfile});

        // delete user
        await User.findByIdAndDelete(id);

        // return response
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully.",

        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to delete account, please try again",
        })
    }
}

//GetAllUserDetails

exports.getAllUserDetails = async (req, res) =>{
    try
    {
        // get user id
        const id = req.user.id;

        // validate and get details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if(!userDetails)
        {
            return res.status(401).json({
                success: false,
                message: "User Not Found",
            })
        }


        // return response
        
        return res.status(200).json({
            success: true,
            message: "User Details got",
            userDetails,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to get user Details , please try again",
        })
    }
}