const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const Comment = require('../models/comment');
const CourseItem = require("../models/CourseItems");

module.exports.setupSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        io.emit("connected");
        // console.log("Socket here, troubling");
        socket.on("join", async (room) => {
            socket.join(room);
            io.emit("roomJoined", room);
        });

        socket.on("message", async (data) => {
            console.log("Message!")
            const { courseItem_id, user, text } = data;
            // console.log(user);
            const timestamp = Date.now();
            const queryParams = {
                text: text,
                timestamp: timestamp,
                user_id: user._id,
                courseItem_id: courseItem_id
            };
            const comment = await Comment.create(queryParams);
            await CourseItem.findByIdAndUpdate(courseItem_id, {
                $push: { childComments: comment._id }
            });
            const newComment = {
                user,
                comment,
            }
            io.in(courseItem_id).emit("newComment", newComment);
        });

        socket.on("typing", (data) => {
            if (data.typing == true)
                io.in(data.courseItem_id).emit('display', data)
            else
                io.in(data.courseItem_id).emit('display', data)
        })
    });
};