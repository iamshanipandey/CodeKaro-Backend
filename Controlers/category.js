const Category = require("../models/Category")

// Create category handler function

exports.createCategory = async (req, res) => {
    
   try
   {
     // fetch data
     const {name, description} = req.body;

     // validation
 
     if(!name || !description)
     {
         return res.status(401).json({
             success: false,
             message: "All fileds are required",
         })
     }
 
     // create new category in db
    
     const categoryDetails = await Category.create({name:name, description: description});
     
     return res.status(200).json({
         success: true,
         message: "Category created",
     })
   }
   catch(error)
   {
        return res.status(500).json({
            success: false,
            message: "Kya hai error",
        })
   };
};

exports.showAllCategories = async (req, res) =>{
    try
    {
        const allCategory = await Category.find({}, {name: true, description:true});
        return res.status(200).json({
            success: true,
            message: "All category are returned",
            allCategory,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message: error.message,     
        })
    }
}

// categoryPageDetails

exports.categoryPageDetails = async (req, res) =>{
    try
    {
        // get categoryID
        const {categoryId} = req.body;

        // get course for specified category
        const selectedCategories = await Category.findById(categoryId)
                                                .populate("courses")
                                                .exec();
        // validation
        if(!selectedCategories)
        {
            return res.status(401).json({
                success: false,
                message: "Data not found",
            })
        }

        //  get course for different catagories
        const differentCategories = await Category.find(
                                            {
                                                _id: {$ne: categoryId},
                                            })
                                            .populate("courses")
                                            .exec();

        // TODO: Get top selling courses
        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategories,
                differentCategories,
            },
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Unable to get courses based on category, please try again",
        })
    }
}