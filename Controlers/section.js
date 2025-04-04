const Section = require("../models/Section");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// create new section

exports.createSection = async(req, res) =>{
    try
    {
        //fetch data
        const {sectionName, courseId} = req.body;
        // validate data
        if(!sectionName ||!courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fileds are required",
            });
        };
        
        // craete section
        const section = await Section.create({sectionName});
    
        // update course schema
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                            courseId, 
                                                            {
                                                                $push :{
                                                                courseContent: section._id,
                                                                        },
                                                            },
                                                            {new:true}).populate(
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
            message: "Section created successfully.",
            data: updateCourseDetails,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message: "Unable to create section please try again",
        })   
    }
}

// update section

exports.updateSection = async (req, res) =>{
    try
    {
        //fetch data
        const {sectionName, sectionId, courseId} = req.body;
        
        // validate data
        if(!sectionName || !sectionId || !courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        };

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, 
                                                            {
                                                                sectionName: sectionName,        
                                                            },
                                                            {new:true});
        // return response

        const course = await Course.findById(courseId).populate(
                                            {
                                                path:"courseContent",
                                                populate:
                                                    {
                                                        path:"subSection"
                                                    }
                                            }
                                            ).exec();

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully.",
            data: course,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to update section , try again",
            error: error.message,
        })
    }
}

// delete section

exports.deleteSection = async (req, res) =>{
    try
    {
        // get id from params : assuming that we are sending ID in params
        const {sectionId, courseId} = req.body

        // validate data
        if(!sectionId || !courseId)
        {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            });
        };

        // delete from db
        await Section.findByIdAndDelete(sectionId);

        try
        {
            
           
        }
        catch(error)
        {
            console.error;
        }
        
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
            message: "Section deleted successfully",
            data: course,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, try again",
        });
    };


}