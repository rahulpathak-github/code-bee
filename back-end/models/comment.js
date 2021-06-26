const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    likers: [mongoose.Schema.Types.ObjectId],
    dislikes: {
        type: Number,
        required: true,
        default: 0,
    },
    dislikers: [mongoose.Schema.Types.ObjectId],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    courseItem_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;