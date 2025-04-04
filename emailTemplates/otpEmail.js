async function otpEmailTemplate(email, title, body){

    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${email}`,
        text: `Dear User, Your OTP for registration is ${body}. Please verify your account within 5 minutes.`,
        subject : `Verfication Email`,
        html: `

                      
            
            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->

                         <p style="font-weight: 800; font-size: 20px; margin:0; color:#000814;">OTP Verification Email</p>
                        <p style="font-size: 16px; color:#000814;">Dear User</p>
                        <p style="font-size: 16px; color:#000814;">Thank you for registering with Codekaro to complete your registeration, please use the following OTP(One Time Password) to verify your account:</p>
                        <p style="font-size:26px; color:#000814; font-weight:900;">${body}</p>
                        <p style="font-size: 16px; color:#000814;">This OTP is valid for 5 minutes only, If you did not request this Verification, please disregards this email. Once your account is verfied, you will have access to our platform and its features. </p>
                        <p style="color: #838894; font-size: 14px;">if your have any question or need assistance, please feel free to reach out to us at: <a href="mailto:iamshanipandey@gmail.com">iamshanipandey@gmail.com</a> We are here to help!</p>
                    </td>
                </tr>
            </table>
        
        `
    };
}

async function contactFormEmailTemplate(email, title, body){
    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${email}`,
        text: `${body}`,
        subject : `${title}`,
        html: `
            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->

                        <p style="font-weight: 600; font-size: 18px;">Form Data</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Field</th>
                                    <th>Value</th>
                                </tr>
                                    
                            </thead>
                            <tbody style="margin-left:100px;">
                                <tr>
                                    <td>First Name</td>
                                    <td>${body.firstName}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>${body.lastName}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>${body.email}</td>
                                </tr>
                                <tr>
                                    <td>Phone Number</td>
                                    <td>${body.phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td>Message</td>
                                    <td>${body.message}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </td>
                </tr>
            </table>
        
        `
    };
}


async function resetPasswordEmail(email, body, link){
    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${email}`,
        text: `Follow the link to reset you password`,
        subject : `Dear User, Reset Your password using link`,
        html: `

            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->

                        <p>You can reset you password using link : ${link}</p>
                        <p style="color: #838894; font-size: 14px;">If you didn't request this, please contact us now.</p>
                        <p style="color: #838894; font-size: 14px;">if your have any question or need assistance, please feel free to reach out to us at: <a href="mailto:iamshanipandey@gmail.com">iamshanipandey@gmail.com</a> We are here to help!</p>
                    </td>
                </tr>
            </table>

        `
    }
}

async function resetPasswordConfirmationEmail(email, body, firstName){
    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${email}`,
        text: `You have successfully reset your password`,
        subject : `Dear ${firstName}, Your password has been successfully reset`,
        html: `

            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->

                        <p>Dear ${firstName}, You Password has been successfully updated.</p>
                        <p style="color: #838894; font-size: 14px;">If you didn't request this, please contact us now.</p>
                        <p style="color: #838894; font-size: 14px;">if your have any question or need assistance, please feel free to reach out to us at: <a href="mailto:iamshanipandey@gmail.com">iamshanipandey@gmail.com</a> We are here to help!</p>
                    </td>
                </tr>
            </table>

        `
    }
}


module.exports={otpEmailTemplate, contactFormEmailTemplate, resetPasswordEmail, resetPasswordConfirmationEmail};

