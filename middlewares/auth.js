const jwt = require("jsonwebtoken");
const users = require("../models/Users");
require("dotenv").config();


//auth

exports.auth = async (req, res, next) =>{
    try{
        
        // Finding Token from req.body or header or cookies
        const token = req.body.token || req.cookies.token || 
                      req.header("autherization").replace("Bearer ","");

        // Check if token is peresent

        if ( !token)
        {
            return res.status(401).json({
                success: false,
                message: "Token not found",
            })
        }
       
        try{
            const decode = jwt.verify(token, process.env.JBT_SECRET);
            console.log(decode);
            req.user = decode;

        }
        catch(error)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            })
        }

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, while validating token"
        })
    }
};



// isStudent

exports.isStudent = async (req, res, next) =>{
    try{

        if(req.user.accountType != "Student")
        {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for Student ONLY",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again",
        })
    }
};



// instructor

exports.isInstructor = async (req, res, next) =>{
    try{

        if(req.user.accountType != "Instructor")
        {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for Instructor ONLY",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again",
        })
    }
};



//isAdmin

exports.isAdmin = async (req, res, next) =>{
    try{

        if(req.body.accountType != "Admin")
        {
            return res.status(401).json({
                success: false,
                message: "This is protected Route for Admin ONLY",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified, Try again",
        })
    }
};