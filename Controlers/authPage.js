const Users = require("../models/Users");
const Otp = require("../models/Otp");
const OtpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

//Otp sent

exports.sendOTP = async (req, res) =>   {
    try{
        //fetching email from req body
        const {email} = req.body;

        //Check if user already exist

        const checkUserExist = await Users.findOne({email});
        
        if (checkUserExist)
        {
            return res.status(401).json({
                success: false,
                message: "User Already Exists",
            });
        }

        // Generating OTP

        const otp = OtpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
 
        //check if otp already exist

        const isOtpDuplicate = Otp.findOne({otp : otp})

        while(!isOtpDuplicate)
        {
            const otp = OtpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            isOtpDuplicate = Otp.findOne({otp: otp});
        }

        const payLoad = {email, otp};

        const saveOTP = await Otp.create(payLoad);
        console.log(saveOTP)
        console.log(payLoad)
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating OTP",
        })
    }
}

// Signup 

exports.signUp = async (req, res) =>{
    try{
        // fetching all details from req.body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp // DOUBT..?? bhai jis time pe ye wala code run hoga yani ki jab user signup ke button pe clic krega.. uss tym pe to OTP user dalega hi nhi.. otp to jab next scren ayega tab dalega.. to req ki body me to otp ayega hi nhi kyuki otp ki field to next wale req. ki body me ayegi jab user otp dal ke submit otp pe click krega.
        } = req.body;

        //validating details
        
        if (!firstName || !lastName || !email || !password || !confirmPassword
            || !accountType || !otp)
            {
                return res.status(401).json({
                    success: false,
                    message: "All fields are Required",
                })
            }
        
        const checkUserExist = await Users.findOne({email});
        if ( checkUserExist)
        {
            return res.status(401).json({
                success: false,
                message: "User already Exists",
            })
        }

        if(password != confirmPassword)
        {
            return res.status(401).json({
                success: false,
                message: "Password Doesn't match",
            });
        }

        // finding otp from database.

        const recentOTP = await Otp.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent OTP from Database ", recentOTP);

        //validate OTP
        if(recentOTP.length == 0)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to get OTP",
            })
        }
        else if(recentOTP.otp != otp)
        {
            return res.status(401).json({
                success:false,
                message : "Invalid OTP",
            })
        }

            
        // password hashing

        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
            profession: null,
        });

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails,
            profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })


        const payload = {
            email: user.email,
            id: user.id,
            accountType: user.accountType, 
        }

        let token = jwt.sign(payload, process.env.JBT_SECRET, {
            expiresIn: "1h",
        });

        user.token = token;
        user.password = undefined;

        // push user into req.body
        req.body.user = {
            ...user.toObject(), // convert mongoDb document to plain object
            token,
        }

        return res.status(200).json({
            success: true,
            message: "User Regsitered Successfully",
            user,
            
        })

    }
    catch(error)
    {
        return res.status(401).json({
            success: false,
            message: "Unable to regsiter. Please Try again",
        })
    }
}

// Login

exports.logIn = async (req, res)=>
{
    try{
    
        const {email, password} = req.body;

        if ( !email || !password)
        {
            return res.status(401).json({
                success: false,
                message: "Please enter Email and Password",
            })
        }
    

        const user = await Users.findOne({email}).populate("additionalDetails").populate("courseProgress").exec(); 
        
        if (!user)
            {
                return res.status(401).json({
                    success: false,
                    message: "User Does not exsits, Please Register First",
                })
            }

        // Check password 

        if ( await bcrypt.compare(password, user.password)) 
        {
            const payload = {
                email: user.email,
                id: user.id,
                accountType: user.accountType, 
            }

            //JBT token generate

            let token = jwt.sign(payload, process.env.JBT_SECRET, {
                expiresIn: "1h",
            });

            user.token = token;
            user.password = undefined;

            // push user into req.body
            req.body.user = {
                ...user.toObject(), // convert mongoDb document to plain object
                token,
            }
        
            // Options

            const options = {
                expires: new Date(Date.now() + 3*24*60*1000),
                httpOnly: true,
            }
            // create cookies
            return res.cookie("token", token, options).status(200).json({
                success: true,
                user: req.body.user,
                token,
                message: "User Logged In",
            })
        }
        else
        {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Login Failed, Try again",
        })
    }
};

//change password

exports.changePassword = async (req, res) =>{
    try{
        // Getting details from req

        const {email, password, newPassword, confirmNewPassword} = req.body;

        //check if any field is empty
    
        if(!password || !newPassword ||!confirmNewPassword ||!email)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check if new password doesn't match with confirm new password

        if(newPassword != confirmNewPassword)
        {
            return res.status(401).json({
                success: false,
                message: "Password Doesn't match with Confirm Password",
            });
        };

        // check if new password is equal to old password
        if(newPassword == password)
            {
                return res.status(401).json({
                    success: false,
                    message: "Choose a Different Password",
                });
            };
        // getting user details 

        const user = await Users.findOne({email:email});

        // checking entered old password is correct or not

        if(! await bcrypt.compare(password, user.password))
        {
            return res.status(401).json({
                success: false,
                message: "Please Enter Correct Old Password",
            })
        }
        else
        {
            // hasing new password 
            const hashPassword = await bcrypt.hash(newPassword, 10);

            // update database with new hashed password
            await Users.findOneAndUpdate({email:email},{password:hashPassword})
            return res.status(200).json({
                success: true,
                message: "Password Changed Successfully",
            });
        }

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Changing Password",
        })
    }
}

