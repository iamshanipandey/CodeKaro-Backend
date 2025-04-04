const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body, functionCall) => {
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        const emailOptions = await functionCall(email, title, body)

        let info = await transporter.sendMail({
            from: "CodeKaro - Coding with CodeKaro",
            to: `${emailOptions.to}`,
            subject: `${emailOptions.subject}`,
            text : `${emailOptions.text}`,
            html: `${emailOptions.html}`,
        })

        console.log(info);
        return info;
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = mailSender;