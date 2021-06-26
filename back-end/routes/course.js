const express = require("express");
const { getAllCourse, getCourse, getCourseItem } = require('../controllers/CourseController');

const router = express.Router();

router.get("/getCourse/:id", getCourse);
router.get("/courseItem/:id", getCourseItem);
router.get("/", getAllCourse);

module.exports = router;