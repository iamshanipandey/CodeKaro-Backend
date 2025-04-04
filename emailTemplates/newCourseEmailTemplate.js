async function newCourseEmailTemplate(course, title, body){

    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${course.email}`,
        text: `Dear User, You Have Successfully Enrolled in Course`,
        subject : `Dear ${course.firstName}, You Have Successfully Enrolled in New Course`,
        html: `

                      
            
            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->
                        <p>Dear ${course.firstName},</p>
                        <p>You have successfully Enrolled in New Course</p>
                        <p>Please Follow Below Link To Start You Course Now</p>
                        <a style="padding-top: 8px; padding-bottom: 8px; padding-left: 40px; padding-right: 40px; border-radius: 8px; background-color: #FFD60A; color: black;" to="localhost:3000/my-course">Start Now</a>
                        <p style="color: #838894; font-size: 14px;">if your have any question or need assistance, please feel free to reach out to us at: <a href="mailto:iamshanipandey@gmail.com">iamshanipandey@gmail.com</a> We are here to help!</p>
                    </td>
                </tr>
            </table>
        
        `
    };
}


async function paymentConfirmationEmail(orderDetails, title, userDetails){

    console.log("Order Details are there : " , orderDetails);

    return{
        from: "CodeKaro - E-Learning Plateform",
        to: `${userDetails.email}`,
        text: `Dear User, You Have Successfully Enrolled in Course`,
        subject : `Dear ${userDetails.firstName}, Payment of ₹${orderDetails.amount} has been recieved`,
        html: `
            <table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial; border-collapse: collapse; text-align: center;">
                <tr>
                    <td style="padding: 20px; margin-left:auto; margin-right:auto; text-align: center;">

                         <!-- Logo -->

                         <img style="width:210px; height:62px; border-radius:20px;" src="http://res.cloudinary.com/du9ipirr7/image/upload/v1740257431/CodeKaro/srmt603e6ik4yahmr8m1.png" alt="Codekaro Logo"/>

                         
                        <!-- Body -->

                        <p>Dear ${userDetails.firstName},</p>
                        <p>Your Payment of ₹${orderDetails.amount} Has Been Recieved, You Will Shortly Recieve an Email for Your Course Purchase Confirmation.
                        <p>Payment Id : ${orderDetails.payment_id}</p>
                        <p>Order Id : ${orderDetails.order_id}</p>
                        <p>Amount : ₹${orderDetails.amount}</p>  
                        <p style="color: #838894; font-size: 14px;">if your have any question or need assistance, please feel free to reach out to us at: <a href="mailto:iamshanipandey@gmail.com">iamshanipandey@gmail.com</a> We are here to help!</p>
                    </td>
                </tr>
            </table>
        
        `
    };
}

module.exports={newCourseEmailTemplate, paymentConfirmationEmail};



