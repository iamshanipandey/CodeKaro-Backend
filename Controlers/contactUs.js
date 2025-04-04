const mailSender = require("../utils/mailSender")
const {contactFormEmailTemplate} = require("../emailTemplates/otpEmail")

exports.contactUs=async(req, res)=>{
    
        //find Data
        const {firstName, lastName, email, phoneNumber, message} = req.body;

        //Validation

        if(!firstName, !email, !phoneNumber, !message)
        {
            return res.status(401).json({
                success: false,
                message: "Incomplete Data",
            })
        }
        try{
            const response = await mailSender("pandayshani511@gmail.com", "New Message From CodeKaro", {firstName, lastName, email, phoneNumber, message},contactFormEmailTemplate)
            console.log(response)
            if(!response)
            {
                return res.status(401).json({
                    success: false,
                    message: "Server Error",
                })
            }
            return res.status(200).json({
                success: true,
                message: "Response Captured",
            })
        }
        
        catch(error)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to Capture Message",
            })
        }
}