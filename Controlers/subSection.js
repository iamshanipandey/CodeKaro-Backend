const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config();

// create subSection
exports.createSubSection = async(req, res) =>{
    try
    {
        // fetch data
        const {sectionId, name, description, courseId} = req.body;
        
        // fetch video file
        const video = req.files.video;

        // validate data
        if ( !sectionId || !name || !description|| !video || !courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        };
        
        // upload media to cloudinary
        
        const uploadedVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        
        
        
        // create subSection
        
        const subSection = await SubSection.create(
            {
                title: name,
                description: description,
                // timeDuration: timeDuration,
                videoUrl : uploadedVideo.secure_url,        
            })
                                   
        // update section with subSection objectId
       
        const updatedSectionDetails = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {
                                                                    $push:{
                                                                        subSection: subSection._id,
                                                                    }
                                                                },
                                                                {new:true},)

        const course = await Course.findById(courseId).populate(
                                                        {
                                                            path:"courseContent",
                                                            populate:
                                                                {
                                                                    path:"subSection"
                                                                }
                                                        }
                                                        ).exec();
                                                        
        // return response
        console.log("success");
        return res.status(200).json({
            success: true,
            message: "Sub Section created successfully",
            data: course,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to create sub section. please try again later",
        });
    };
};

// update subSection
exports.updateSubSection = async(req, res) =>{
    try
    {
        // fetch data
        const {subSectionId, title, description, courseId} = req.body;

        // fetch media file
        console.log("hii")
        let media;
        try
        {
            media = req.files.video;
        }
        catch(error)
        {

        }
        console.log("hiilo")

        // validate data
        if (!subSectionId || !title || !description || !courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        }

        // upload media on cloudinary
        let mediaUpload
        if(media)
        {
             mediaUpload = await uploadImageToCloudinary(media, process.env.FOLDER_NAME);
             await SubSection.findByIdAndUpdate(subSectionId, 
                                                {
                                                    videoUrl : mediaUpload.secure_url,
                                                },
                                                {new:true},)
        }
            
    

        // update subSection
        const subSection = await SubSection.findByIdAndUpdate(subSectionId, 
                                                {
                                                    title: title,
                                                    description: description,
                                                },
                                                {new:true},)

        const course = await Course.findById(courseId).populate(
                                            {
                                                path:"courseContent",
                                                populate:
                                                    {
                                                        path:"subSection"
                                                    }
                                            }
                                            ).exec();
    
        // return response
        return res.status(200).json({
            success: true,
            message: "Sub Section Updated Successfully",
            data: course,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to update sub section, please try again",
            error: error.message,
        });
    };
};

// delete sub section
exports.deleteSubSection = async(req, res) =>{
    try
    {
        // fetch subSection id : assuming we are giving Id in params
        const {subSectionId, courseId} = req.body;

        console.log(subSectionId, courseId)
        // validate
        if(!subSectionId || !courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        };

        // delete subSection
        await SubSection.findByIdAndDelete(subSectionId);

        const course = await Course.findById(courseId).populate(
                                            {
                                                path:"courseContent",
                                                populate:
                                                    {
                                                        path:"subSection"
                                                    }
                                            }
                                            ).exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "Sub Section deleted Successfully",
            data: course,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to delete sub section, try again",
            error: error.message,
        });
    };
};
