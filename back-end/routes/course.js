const express = require("express");
const { getAllCourse, getCourse, getCourseItem, addCourse, addCourseItem } = require('../controllers/CourseController');

const router = express.Router();

router.get("/getCourse/:id", getCourse);
router.get("/courseItem/:id", getCourseItem);
router.post("/addCourse", addCourse)
router.post("/addCourseItem", addCourseItem)
router.get("/", getAllCourse);

module.exports = router;