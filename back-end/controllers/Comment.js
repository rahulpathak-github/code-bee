const Comment = require("../models/comment");
const CourseItem = require('../models/CourseItems');
const User = require('../models/user');

exports.getComments = async function (req, res) {
    try {
        const parentItem_id = req.params.courseItem_id
        const parentItem = await CourseItem.findById(parentItem_id)

        const discussion = await Comment.find({ _id: { $in: parentItem.childComments } });

        const comments = [], user_id = [];
        for (let i = 0; i < discussion.length; ++i) user_id.push(discussion[i].user_id);

        const users = await User.find({ _id: { $in: user_id } });

        const map = new Map();

        for (let i = 0; i < users.length; ++i) map[users[i]._id] = i;

        for (let i = 0; i < discussion.length; ++i) comments.push({ comment: discussion[i], user: users[map[discussion[i].user_id]] });


        res.status(200).json(comments);
    } catch (error) {
        console.log(error.message);
        res.status(404).json(error.message);
    }
}



