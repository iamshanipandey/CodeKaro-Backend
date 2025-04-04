const express = require("express");
const router = express.Router();

const {
    createCourse,
    updateCourse,
    showAllCourses,
    getCourseDetails,   
    publishCourse,
    instructorCourse,
    deleteCourse,
    categoryCourse,
} = require("../Controlers/course");

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../Controlers/category");

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../Controlers/section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../Controlers/subSection");
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../Controlers/ratingAndReview");

const {contactUs} = require("../Controlers/contactUs")

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

//************************************************************************************************ */
//                                      Category Routes
//************************************************************************************************ */

router.post("/contact-form/submit", contactUs);

router.post("/courses/createcategory",auth, isInstructor, createCategory);

router.get("/courses/showallcategories",showAllCategories);

router.post("/courses/categorypagedetails",auth, isInstructor, categoryPageDetails);



//************************************************************************************************ */
//                                      Course Routes
//************************************************************************************************ */

router.post("/createcourse",auth, isInstructor, createCourse);

router.post("/updateCourse", auth, isInstructor, updateCourse);

router.post("/deleteCourse", auth, isInstructor, deleteCourse)

router.get("/showallcourse", showAllCourses);

router.post("/getCourseDetails", getCourseDetails);

router.post("/publishCourse", auth, isInstructor, publishCourse);

router.post("/getInstructorCourses", auth, isInstructor, instructorCourse);

router.post("/categoryCourse", categoryCourse);


//************************************************************************************************ */
//                                      CourseDetails Routes
//************************************************************************************************ */

router.post("/course/createSection",auth, isInstructor, createSection);

router.post("/course/updateSection", auth, isInstructor, updateSection);

router.post("/course/deleteSection", auth, isInstructor, deleteSection);

router.post("/section/createSubSection", auth, isInstructor, createSubSection);

router.post("/section/updateSubSection", auth, isInstructor, updateSubSection);

router.post("/section/deleteSubSection", auth, isInstructor, deleteSubSection);

//************************************************************************************************ */
//                                      Rating Routes
//************************************************************************************************ */

router.post("/createRating",auth, createRating)

router.post("/getAverageRating", auth, getAverageRating);

router.get("/getAllRating", getAllRating);


module.exports = router;
