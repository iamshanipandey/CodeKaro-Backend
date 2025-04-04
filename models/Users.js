const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        trim : true,
    },
    lastName: {
        type : String,
        required : true,
        trim : true,
    },
    email: {
        type : String,
        required : true,
        trim : true,
    },
    password: {
        type : String,
        required : true,
        trim : true,
    },
    accountType : {
        type : String,
        enum : ["Admin", "Instructor", "Student"],
        required : true,
    },
    additionalDetails: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile",
        required : true,
    },

    token : {
        type:String
    },
    resetPasswordExpires: {
        type: Date,
    },

    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
        required : true,
    }],
    profilePicture : {
        type : String,
        required : true,
    },

    courseProgress : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "CourseProgress",
    }],

});

module.exports = mongoose.model("Users", userSchema);

//Yha pe User name ka collection bnega database me or userSchema formate bta ra hai ki data User name ke 
// collection kaise store hoga.. jaise firstName store hoga to vo string hoga required hoga.. ye sb 
