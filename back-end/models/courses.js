const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    summary: {
        type: String,
        required: true,
    },
    courseItems: [mongoose.Schema.Types.ObjectId],
    thumbnail: {
        type: Buffer
    }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
