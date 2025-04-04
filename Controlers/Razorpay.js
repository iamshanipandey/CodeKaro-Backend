const { default: mongoose } = require("mongoose");
const {instance} = require("../config/Razorpay");
const Course = require("../models/Course");
const Users = require("../models/Users");
const mailSender = require("../utils/mailSender")
const {newCourseEmailTemplate, paymentConfirmationEmail} = require("../emailTemplates/newCourseEmailTemplate")
const crypto = require("crypto");

exports.capturePayment = async (req, res)=>{
    try
    {
        
        const {courses} = req.body;
        const userId = req.user

        if(!courses || !userId)
        {
            return res.status(401).json({
                success: false,
                message: "All Fields are required",
            })
        }

        let totalAmount = 0;
        
        for ( const courseId of courses)
        {
            let course;
            try
            {
                course = await Course.findById(courseId);
                if(!course)
                {
                    return res.status(401).json({
                        success: false,
                        message: "Unable to find Course",
                    })
                }
              
                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid))
                {
                    return res.status(401).json({
                        success: false,
                        message: "Already Enrolled",
                    })
                }
                
                totalAmount = totalAmount + course.price;            
               
            }
            catch(error)
            {
                return res.statsu(500).json({
                    success: false,
                    message: "Unable to find Course, Something went wrong",
                })
            }

            const options = {
                amount: totalAmount * 100, 
                currency: "INR",
                receipt: `rec_${Date.now()}`,
            }

            try
            {
                const paymentResponse = await instance.orders.create(options);
                
                return res.json({
                    success: true,
                    message: "Order Payment Captured",
                    data : paymentResponse,
                })
            }
            catch(error)
            {
                console.log(error)
                return res.status(500).json({
                    success: false,
                    message: "Unable to create Order",
                    error: error.message
                })
            }
        }

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to Capture Payment",
        })
    }
}

// verify Payment
exports.verifyPayment = async(req, res)=>{
    try
    {

        const razorpay_order_id = req.body?.bodyData?.razorpay_order_id;
        const razorpay_payment_id = req.body?.bodyData?.razorpay_payment_id;
        const razorpay_signature = req.body?.bodyData?.razorpay_signature;
        const courses = req.body?.bodyData?.courses;
        const userId = req.user.id;

        console.log("razorpay_order_id", razorpay_order_id, "razorpay_payment_id", razorpay_payment_id, "razorpay_signature", razorpay_signature, "courses", courses, "userId", userId )
        
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses | !userId)
        {
            return res.status(401).json({
                success: false,
                message: "Pyament Failed",
            })
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                        .update(body.toString())
                                        .digest("hex");

        if(expectedSignature === razorpay_signature)
        {
            // Entroll Studnet
            const enrollmentResult = await enrollStudent(courses, userId);

            return res.status(200).json({
                success: true,
                message : "Payment Verified",
                enrollmentData: enrollmentResult
            })
        }

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to Verify Payment",
        })
    }
}

const enrollStudent = async(courses, userId,  res)=>{

    if(!courses || !userId)
    {
        throw new Error("All Fields are required");
    }

    for(const courseId of courses)
    {
        try
        {
            // update course
            const updatedCourse = await Course.findByIdAndUpdate(courseId,{$push: {studentsEnrolled : userId}},{new: true});

            // update student course List
            const updatedUser = await Users.findByIdAndUpdate(userId, {$push: {courses : courseId}}, {new: true});

            const emailSend = await mailSender(updatedUser, "Course Purchased Successfully", "New Course Purchased", newCourseEmailTemplate)

            if(updatedUser && updatedCourse && emailSend)
            {
                return res.status(200).json({

                    success: true,
                    message: "Enrolled Successfully",
                    data: updatedCourse, updatedUser,
                })
            }
        }
        catch(error)
        {
            return res.status(500).json({
                success: false,
                message: "Unable to Update Enrolled Course",
            })
        }
        
    }
}

//send successfully payment email
exports.sendPaymentSuccessfullEmail = async(req, res)=>{
    try
    {
    
        let {amount, payment_id, order_id } = req.body;
        const userId = req.user.id;

        if(!amount || !payment_id || !order_id || !userId)
        {
            return res.status(401).json({
                success: false,
                message : "All Fields are required",
            })
        }


        const userDetails = await Users.findById(userId);
        amount = amount/100;
        const orderDetails = {amount, payment_id, order_id}

        const emailSend = await mailSender(orderDetails, "Payment Recieved Successfully", userDetails, paymentConfirmationEmail);

        return res.status(200).json({
            success: true,
            message: "Email Send",
            data: emailSend,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to send Confirmation Email",
        })
    }
} 


// exports.capturePayment = async (req, res) =>{
//     // get courseId and UserId
//     const {course_Id} = req.boyd;
//     const userId = req.user.id;

//     // validation
//     if (!course_Id)
//     {
//         return res.status(401).json({
//             success: false,
//             message: "Course Id not found",
//         })
//     }

//     // valid course Id
//     let course;// course variable ko bahar isliye bnaya hai taki try block ke bahar bhee iska use kar ske..

//     try
//     {
//         course = await Course.findById(course_Id);
//         // valid courseDetails
//         if(!course)
//         {
//             return res.status(401).json({
//                 success: false,
//                 message: "Course is not valid",
//             })
//         }

//         // user already paid for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid))
//         {
//             return res.status(401).json({
//                 success: false,
//                 message : "User already enrolled for this course",
//             })
//         }
        
//     }
//     catch(error)
//     {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
    
    
//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount : amount*100,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes:
//         {
//             courseId: course_id,
//             userId,
//         }
//     }
//     // intitalize the payment using razorpay
//     try
//     {
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         return res.status(200).json({
//             success: true,
//             message: "Payment Intialized",
//             courseName: course.courseName,
//             courseDescription : course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.orderId,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         })
//     }
//     catch(error)
//     {
//         return res.status(500).json({
//             success: false,
//             message: "Unable to initialize payment",
//         })
//     }

// }

// // verify signature of razorpay server

// exports.verifySignature = async (req,res) =>{
//     const webhookSecret = "12345678";

//     const signature = req.header["x-razorpay-signature"];

//     // 3 Steps to convert the webhookSecret into that hashed formate in which razorpay send the signature.
//     // we will verify the webhook secret which is saved in our backend and send by the razorpay as signature both will be same.

//     // 1 step
//     const shasum = crypto.createHmca("sha256",webhookSecret);

//     // 2nd step
//     shasum.update(JSON.stringify(req.body));

//     //3rd step
//     const digest = shasum.digest("hex");

//     if(signature === digest)
//     {
//         console.log("Payment Varified");

//         const{courseId, userId, } = req.boyd.payload.payment.entity.notes;

//         try
//         {
//             // fullfill actions

//             // 1 add userId into course enrolled
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                             {_id:courseId},
//                                             {$push: {studentsEnrolled:userId}},
//                                             {new:true},
//             )
//             if(!enrolledCourse)
//             {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Unable to find Course",
//                 })
//             }
//             console.log(enrolledCourse);

//             // 2. add courseId into student's course
//             const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id: userId},
//                                                 {$push: {courses:courseId}},
//                                                 {new: true},
//             )
//             console.log(enrolledStudent);

//             //3. Send confirmation mail
//             const emailResponse = await mailSender(
//                                     enrolledStudent.email,
//                                     "Congratulations From Apni Pathshala",
//                                     "Congratulations, You have successfully enrolled in our course"
//             )
            
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature Verified",
//             })

//         }
//         catch(error)
//         {   
//             return res.status(500).json({
//                 success: false,
//                 message: "Something went wrong, please try again",
//             })
//         }
//     }
//     else
//     {
//         return res.status(500).json({
//             success: false,
//             message: "Unable to verify payment, please try again",
//         })
//     }
// }