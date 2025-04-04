const Users = require("../models/Users");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const {resetPasswordEmail, resetPasswordConfirmationEmail} = require("../emailTemplates/otpEmail")



// Generate and send reset password link

exports.resetPasswordLink = async (req, res)=>{
    try{
        const {email} = req.body;
        if(!email)
        {
            return res.status(401).json({
                success: false,
                message: "Please Enter valid email",
            })
        }
        const isExistUser = await Users.findOne({email:email});
        if (!isExistUser)
        {
            return res.status(401).json({
                success: false,
                message: "Please Signup, User is not registered.",
            })
        }

        const token = crypto.randomUUID();

        const updatedUser = await Users.findOneAndUpdate({email:email}, 
                                                        {
                                                            token:token,
                                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                                        }
        )

        const url = `http://localhost:3000/reset-password/${token}`;
        
        await mailSender(email,"body", url, resetPasswordEmail);

        return res.status(200).json({
            success: true,
            message: "Reset Password link sent Successfully.",
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password link.",
        })
    }
}

//reset Password

exports.resetPassword = async(req, res) =>{
    try{

        const {token, password, confirmPassword} = req.body;
        console.log(token, password, confirmPassword);
        if(password !== confirmPassword)
        {
            return res.status(401).json({
                success: false,
                message: "Password doesn't match",
            })
        }

        const userDetails = await Users.findOne({token:token});
        if(!userDetails)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            })
        }
    
        if(Date.now() > userDetails.resetPasswordExpires)
        {
            return res.status(401).json({
                success: false,
                message: "Token Expired",
            })
        }
      
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await Users.findOneAndUpdate({token:token},
                                                    {
                                                        password:hashedPassword
                                                    },
                                                    {now:true},
        );
        console.log(updatedUser);

        await mailSender(userDetails.email, `Body`, userDetails.firstName, resetPasswordConfirmationEmail);
        
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully.",
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password",
        })
    }
}