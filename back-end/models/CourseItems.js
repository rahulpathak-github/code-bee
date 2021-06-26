const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    overView: {
        type: String,
        required: true,
    },
    reading: {
        type: String,
        required: true,
    },
    video: String,
    childComments: [mongoose.Schema.Types.ObjectId]
});

const CourseItem = mongoose.model('CourseItem', ItemSchema);

module.exports = CourseItem;
