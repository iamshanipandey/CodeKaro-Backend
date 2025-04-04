const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () =>{
    try
    {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
        console.log("Cloudinary Connection Established")
    }
    catch(error)
    {
        console.log(error);
        console.log("Cloudinary Connection Couldn't be Established");
    }
}