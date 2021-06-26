const Course = require('../models/courses');
const CourseItem = require('../models/CourseItems');

exports.getAllCourse = async function (req, res) {
    try {
        const courses = await Course.find({}, { name: 1, summary: 1, thumbnail: 1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(404).json({ message: error });
        throw error;
    }
}

exports.getCourse = async function (req, res) {
    try {
        const _id = req.params.id;
        let course = await Course.findById(_id);
        const items = await CourseItem.find({ _id: { $in: course.courseItems } }, { name: 1, overView: 1 });
        for (let i = 0; i < items.length; ++i) {
            course.courseItems[i] = items[i];
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(404).json({ message: error });
        throw error;
    }
}

exports.getCourseItem = async function (req, res) {
    try {

        const { id } = req.params;
        const item = await CourseItem.findById(id);
        res.status(200).json(item);
    } catch (error) {
        res.status(404).json({ message: error });
        throw error;
    }
}