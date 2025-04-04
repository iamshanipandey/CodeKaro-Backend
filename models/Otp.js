const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {otpEmailTemplate} = require("../emailTemplates/otpEmail")

const otpSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true,
    },
    otp : {
        type : String,
        required: true,
    },
    createdAt : {
        type : Date,
        default: Date.now(),
        expires : 5*60,
    },
});



async function sendVerificationCode(email, otp){
    try{
        
        const response = await mailSender(email, "Verification Code", otp, otpEmailTemplate );
        console.log("Mail sent: ",response);
    }
    catch(error)
    {
        console.log("Error while sending verification code", error.message);
    }
}

// Ye otpSchema ke data ko database me save karne se phle email bhejega or successfully mail send hone
// ke bad next middle ware pe chla jaeyga.. isse ye hoga ki ki agar koi signup kar ra hai to 
// agar usne otp galat dala  to databse me entry nhi bnega.. uss new user ki entry tabhi database
// me save hogi jab vo sahi otp daalega..
otpSchema.pre("save", async function(next){
    await sendVerificationCode(this.email, this.otp);
    next();
})


module.exports  = mongoose.model("Otp", otpSchema);