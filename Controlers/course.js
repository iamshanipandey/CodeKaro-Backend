const { default: mongoose } = require("mongoose");
const Category = require("../models/Category")
const Course = require("../models/Course")
const User = require("../models/Users")
const CourseProgress = require("../models/CourseProgress")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

// Create Course
exports.createCourse =  async (req, res) =>{
    
    try
    {
        
        const {courseName, courseDescription, category, whatYouWillLearn, price, tag, instructions , status}  = req.body;
        console.log(status)      
        
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !category || !whatYouWillLearn ||!price || !tag || !instructions || !thumbnail || !status)
        {
            return res.status(401).json({
                success: false,
                message: "All fileds are required",
            });
        };

        //check for intructor 

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if(!instructorDetails)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to authorize you",
            });
        }

       
        // upload thumbnail to cloudinary

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);  
        
        // create entry for new course in DB

        if (typeof req.body.tag === "string") {
            parsedTags = JSON.parse(req.body.tag);
        }
        else{
            parsedTags = req.body.tag;
        }

    
        const newCourse = await Course.create({
                courseName: courseName,
                courseDescription: courseDescription,
                price:price,
                category: category,
                tag: parsedTags,
                instructor: userId ,
                whatYouWillLearn: whatYouWillLearn,
                instructions: JSON.parse(req.body.instructions),
                thumbnail: thumbnailImage.secure_url,
                status: status,
            })
       
        //update instructor course list
        await User.findByIdAndUpdate({
            _id: instructorDetails._id
        },{
            $push: {
                courses : newCourse._id,
            }
        },{
            new:true,
        })

        //update category ka schema

        const populatedCourse = await Course.findById(newCourse._id).populate("category").exec();
        await Category.findByIdAndUpdate({_id: category},
            {
                $push:{
                courses: newCourse._id
            }
        })

        //return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: populatedCourse,
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating a new course, please try again",
        }) 
    };
};

// update course
exports.updateCourse = async (req, res) => {
    try {
        const {
            courseId,
            courseName,
            courseDescription,
            category,
            whatYouWillLearn,
            price,
            tag,
            instructions,
            status
        } = req.body;

        let thumbnail;
        try {
            thumbnail = req.files.thumbnailImage;
        } catch (error) {
            console.log("No thumbnail provided");
        }

        // Validation
        if (!courseName || !courseDescription || !category || !whatYouWillLearn || !price || !tag || !instructions || !status) {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Parse tag to ensure it's an array
        let parsedTags;
        if (typeof tag === "string") {
            parsedTags = JSON.parse(tag); 
        } else {
            parsedTags = tag; 
        }
        let parsedInstructions;
        if (typeof instructions === "string") {
            parsedInstructions = JSON.parse(instructions); 
        } else {
            parsedInstructions = instructions; 
        }

        // Upload thumbnail to Cloudinary if provided
        let thumbnailImage;
        if (thumbnail) {
            thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        }

        // Find and update the course
        const updatedCourse = await Course.findById(courseId);
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Update course details
        updatedCourse.courseName = courseName;
        updatedCourse.courseDescription = courseDescription;
        updatedCourse.price = price;
        updatedCourse.category = category;
        updatedCourse.tag = parsedTags; 
        updatedCourse.whatYouWillLearn = whatYouWillLearn;
        updatedCourse.instructions = parsedInstructions;
        updatedCourse.status = status;

        if (thumbnailImage) {
            updatedCourse.thumbnail = thumbnailImage.secure_url;
        }

        await updatedCourse.save();

        const populatedCourse = await Course.findById(courseId)
                                                    .populate("category") 
                                                    .populate({
                                                        path: "courseContent", 
                                                        populate: {
                                                            path: "subSection", 
                                                        },
                                                    })
                                                    .exec();
                                                                    
        // Return response
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: populatedCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating course, please try again",
        });
    }
};

//Delete Course
exports.deleteCourse = async (req, res)=>{
    try
    {
        const {courseId} = req.body;

        if(!courseId)
        {
            return res.status(401).json({
                success: false,
                message: "Server Error",
            })
        }

        const course = await Course.findById(courseId);
        const instructorId = course.instructor;

        await Course.findByIdAndDelete(courseId);

        // delete course id from instructor course list

        const updateInstructorCourseList = await Course.findByIdAndUpdate(instructorId,
                                                                        {
                                                                            $pull : {course: courseId}
                                                                        },
                                                                        {new:true})

        return res.status(200).json({
            success: true,
            message: "Course Deleted Successfully",
            data: updateInstructorCourseList,
        })
        
    }

    catch(error)
    {
        return res.status(501).json({
            success: false,
            message: "Something went wrong while deleting course",
            error: error,
        })
    }
}

// show all course
exports.showAllCourses = async (req, res) =>{

    try 
    {
        const allCourses = await Course.find({},{
                                                    courseName: true,
                                                    thumbnail: true,
                                                    courseDescription: true,
                                                    price: true,
                                                    instructor: true,
                                                    ratingAndReviews: true,
                                                    studentsEnrolled: true,
                                                    status: true,
                                                }).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: allCourses,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all courses",
        });
    };
};

// getCourseDetails
exports.getCourseDetails = async (req, res) =>{
    try
    {
        // get courseId
        const {courseId} = req.body;

        


        // find course details
        const courseDetails = await Course.find(
                                    {_id: courseId},)
                                    .populate(
                                        {
                                            path:"instructor",
                                            populate:
                                            {
                                                path:"additionalDetails",
                                            }
                                        }
                                        
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },
                                    })
                                    
        
        console.log(courseDetails);
        
        // Validation
        if(!courseDetails)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to fetch course",
            })
        }

        // return response
        return res.status(200).json({
            success: true,
            message: "Course Details Fatched Successfully",
            courseDetails,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to get course details, please try again",
        })
    };
};

// Publish Course
exports.publishCourse = async(req, res)=>{
    try
    {
        const {courseId, status} = req.body;
        const course = await Course.findByIdAndUpdate(courseId,{
                                                        status: status,
                                                        }, {new:true})

        if(course)
            return res.status(200).json({
                success: true,
                message: "Saved",
                data:course,
            })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to Save Settings",
        })
    }
}

// get instructor's Course
exports.instructorCourse = async(req, res)=>{
    try
    {
        const {id} = req.user;

        if(!id)
        {
            return res.status(400).json({
                success: false,
                message: "Unable to Get Courses",
            })
        }

        const courses = await Course.find({instructor : id});
        return res.status(200).json({
            success: true,
            message: "Course Fetched",
            data : courses,
        })
    }
    catch(error)
    {   
        return res.status(500).json({
            success: false,
            message: "Unable to fetch Courses",
            error: error.message,
        })
    }
}

// get Course Category Wise
exports.categoryCourse = async(req, res)=>{
    try
    {
        const {categoryId} = req.body;

        if(!categoryId)
        {
            return res.status(401).json({
                success: false,
                message : "Category Not Found",
            })
        }

        const course = await Course.find({category : categoryId}).populate("category").exec();
        const category = await Category.findById(categoryId);

        return res.status(200).json({
            success: true,
            message: "Course Fetched",
            data : course,category
        })
    }
    catch(error)
    {
        return res.status(501).json({
            success: false,
            message: "Unable to Found Course",
        })
    }
}

// getEnrolledCourse

exports.getEnrolledCourse = async(req, res)=>{
    try
    {
        const {id} = req.user;

        if(!id)
        {
            return res.status(401).json({
                success: false,
                message: "Unable to Find User",
            })
        }

        const userDetails = await User.findById(id)
                                                .populate({
                                                    path:"courses",
                                                    populate: {
                                                        path: "courseContent",
                                                        populate : {
                                                            path: "subSection",
                                                        }
                                                    }
                                                })
        
        return res.status(200).json({
            success: true,
            message: "Enrolled Courses Fetched Successfully",
            enrolledCourses : userDetails.courses,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to find Enrolled Courses",
        })
    }
}


// Controller to mark a subSection as completed
// exports.markSubSectionAsComplete = async (req, res) => {
//   try {
//     const userId = req.user.id; // assuming you're using auth middleware to attach user
//     const { courseId, subSectionId } = req.body;

//     // Validate inputs
//     if (!courseId || !subSectionId) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     // Get user
//     const user = await User.findById(userId).populate("courseProgress");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if CourseProgress already exists for this course
//     let courseProgress = user.courseProgress.find((progress) =>
//       progress.courseId.toString() === courseId
//     );

//     // If it doesn't exist, create new one
//     if (!courseProgress) {
//       const newCourseProgress = await CourseProgress.create({
//         courseId,
//         completedVideos: [subSectionId],
//       });

//       user.courseProgress.push(newCourseProgress._id);
//       await user.save();

//       return res.status(200).json({
//         success: true,
//         message: "Progress created and subSection marked as complete",
//       });
//     }

//     // If already exists, check if this subSection is already marked complete
//     if (!courseProgress.completedVideos.includes(subSectionId)) {
//       courseProgress.completedVideos.push(subSectionId);
//       await courseProgress.save();
//     }

//     return res.status(200).json({
//       success: true,
//       message: "SubSection marked as complete",
//     });
//   } catch (error) {
//     console.error("Error marking subSection complete:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong, please try again",
//     });
//   }
// };


