const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async(req, res) =>{
    try
    {
        // get userId
        const {userId} = req.user.id;
        console.log("yes")
        // fetch data from req body
        const {rating, review, courseId} = req.body;

        // check if user is not enrolled
                                                                                // ----------------------------------------------
                                                                                // const courseDetails = await Course.findOne(
                                                                                //                             {_id:courseId},
                                                                                //                         )
                                                                                // if(!Array.isArray(courseDetails.studentsEnrolled) || !courseDetails.studentsEnrolled.includes(userId))
                                                                                // {
                                                                                //     return res.status(401).json({
                                                                                //         success: false,
                                                                                //         message: "User not enrolled in this course",
                                                                                //     })
                                                                                // }
                                                                                // ye wala code bhee use kar skte hai.
                                                                                // --------------------------------------------------

        const courseDetails = await Course.findOne(
                                {_id:courseId
                                    ,studentsEnrolled: {$elemMatch: {$eq: userId}},
                                });
        if(!courseDetails)
        {
          return res.status(401).json({
                success: false,
                message: "User not enrolled in this course",
            })
        }

        // check if user already reviewed for this course
        const alreadyReviewed = await RatingAndReviews.findOne(
                                            {
                                                user: userId,
                                                course: courseId,
                                            
                                            });
        if(alreadyReviewed)
        {
          return res.status(401).json({
                success: false,
                message: "User already reviewed",
            })
        }

        // create rating
        const newReviewAndRating = await RatingAndReviews.create(
                                                {
                                                    user:userId,
                                                    course:courseId,
                                                    rating, review,
                                                }
                                            );
        
        //updated course with this review and rating

        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                    {_id: courseId},
                                                    {
                                                        $push: {
                                                            ratingAndReviews:newReviewAndRating._id,
                                                        }
                                                    },
                                                    {
                                                        new:true,
                                                    },
        );
        
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            newReviewAndRating,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to create rating and review, please try again",
        });
    }
}

//getAverageRating

exports.getAverageRating = async (req, res) =>{
    try
    {
        // get courseId
        const {courseId} = req.body;

        console.log("yes");

        // calculate average rating
        const result = await RatingAndReviews.aggregate([
                                    {
                                        $match: {
                                            course: new mongoose.Types.ObjectId(courseId),
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: null, 
                                            averageRating : {$avg:"$rating"},
                                        }
                                    }]);
                                    console.log("ya hu")
        // return rating
        if(result.length > 0)
        {
            return res.status(200).json({
                success: true,
                message: "Average Rating Calculated",
                averageRating: result[0].averageRating,
            })
        }
        
        // if no rating/review given to course till now
        return res.status(401).json({
            success: false,
            message: "Average Rating is 0, There is no rating given to this course till now",
            averageRating: 0,
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to calculate the average rating , please try again",
    
        })
    }
}

// TODO: Get all rating of a specific course
// getAllRating

exports.getAllRating = async (req, res) =>{
    try
    {
        const allRating = await RatingAndReviews.find({})
                                        .sort({rating:"desc"})
                                        .populate({
                                            path: "user",
                                            select: "firstName lastName email profilePicture"
                                        })
                                        .populate({
                                            path:"course",
                                            select: "courseName",
                                        })
                                        .exec();
    return res.status(200).json({
        success: true,
        message: "All rating and review fetched.",
        data:allRating,
    })

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to get all rating and review, please try again",
        })
    }
}