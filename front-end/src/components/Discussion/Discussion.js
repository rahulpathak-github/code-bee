import React, { useEffect, useRef } from 'react';
import { Comment, Avatar, Form, Button, List, Input, Tooltip } from 'antd';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import "antd/dist/antd.css";
import { useState } from 'react';
import { getAllComments } from './../../network/ApiAxios';
import 'react-chat-widget/lib/styles.css';
import { useCallback } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';


const socketio = require('socket.io-client');
const { TextArea } = Input;

function Is(userId, reactors) {
    for (let i = 0; i < reactors.length; ++i) {
        if (userId == reactors[i]) return true;
    }
    return false;
}

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);

function CommentBox(props) {
    const [state, setState] = useState({ submitting: false, value: "" });
    let user = JSON.parse(localStorage.getItem("user"));
    const socketClientRef = useRef()

    useEffect(() => {
        const io = socketio("http://172.105.63.162:5100/", {
            query: {
                token: localStorage.getItem("token"),
            }, withCredentials: true
        });
        socketClientRef.current = io
    }, [props._id]);
    async function handleSubmit() {
        if (!state.value) {
            return;
        }

        setState((state) => { return { ...state, submitting: true } });

        socketClientRef.current.emit("message", {
            text: state.value,
            courseItem_id: props._id,
            user: user
        });

        setState({
            submitting: false,
            value: ''
        });
    }

    return (
        <Comment
            avatar={
                <Avatar
                    src="https://spiderimg.amarujala.com/assets/images/2019/01/21/750x506/sarthak_1548056481.jpeg"
                    alt={user.name}
                />
            }
            content={
                <Editor
                    onChange={e => setState(state => { return { ...state, value: e.target.value }; })}
                    onSubmit={handleSubmit}
                    submitting={state.submitting}
                    value={state.value}
                />
            }
        />
    );
}

function Discussion(props) { // props -> courseItem id

    // useEffect(() => {
    //     addResponseMessage('Welcome to this awesome chat!');
    // }, []);

    // const handleNewUserMessage = (newMessage) => {
    //     console.log(`New message incoming! ${newMessage}`);
    //     // Now send the message throught the backend API
    //     addResponseMessage("response");
    // };

    // return (
    //     <Widget
    //         handleNewUserMessage={handleNewUserMessage}
    //         title='My E-commerce Live Chat'
    //         subtitle='Ready to help you'
    //     />
    // );


    const [state, setState] = useState([]);
    const socketClientRef = useRef()

    let user = JSON.parse(localStorage.getItem("user"));

    function added(data) {
        console.log(data);
        setState(curState => [data, ...curState]);
    }

    function reacted(data) {
        setState(curState => curState.map(comment => comment.comment._id !== data._id ? comment : { user: comment.user, comment: data }));
    }

    function deleted(data) {
        setState(curState => curState.filter(comment => comment.comment._id !== data.comment_id));
    }

    async function getComments() {
        const items = await getAllComments(props._id);
        const updatedComments = [];
        for (let i = items.data.length - 1; i >= 0; --i) {
            updatedComments.push(items.data[i]);
        }
        setState(updatedComments);
    }



    useEffect(() => {
        getComments()
        const io = socketio("http://172.105.63.162:5100/", {
            query: {
                token: localStorage.getItem("token"),
            }, withCredentials: true
        });
        io.on("connected", () => io.emit("join", props._id));
        io.on("newComment", added);
        io.on("deletedMessage", deleted);
        io.on("likedmessage", reacted);
        io.on("dislikedmessage", reacted);
        socketClientRef.current = io
    }, [props._id]);

    async function like(e) {
        let v = e.target;
        while (v.parentNode.nodeName != 'LI') v = v.parentNode;
        socketClientRef.current.emit("like", { comment_id: v.id, courseItem_id: props._id, user: user });
    }

    async function dislike(e) {
        let v = e.target;
        while (v.parentNode.nodeName != 'LI') v = v.parentNode;
        socketClientRef.current.emit("dislike", { comment_id: v.id, courseItem_id: props._id, user: user });
    }

    async function deleteIt(e) {
        let v = e.target;
        while (v.parentNode.nodeName != 'LI') v = v.parentNode;
        socketClientRef.current.emit("deleteMessage", { comment_id: v.id, courseItem_id: props._id });
    }

    function createAction(likes, dislikes, likers, dislikers, comment_id, userId) {
        const liked = Is(user._id, likers);
        const disliked = Is(user._id, dislikers);
        let action = [
            <Tooltip key="comment-basic-like" title="Like">
                <span onClick={(liked || disliked) ? null : like} id={comment_id}>
                    {React.createElement(liked ? LikeFilled : LikeOutlined)}
                    <span className="comment-action">{likes}</span>
                </span>
            </Tooltip>,
            <Tooltip key="comment-basic-dislike" title="Dislike">
                <span onClick={(liked || disliked) ? null : dislike} id={comment_id}>
                    {React.createElement(disliked ? DislikeFilled : DislikeOutlined)}
                    <span className="comment-action">{dislikes}</span>
                </span>
            </Tooltip>,
        ];
        if (userId === user._id) {
            action.push(<span id={comment_id} onClick={deleteIt}> <DeleteOutlined /> </span>);
        }
        return action;
    }

    return (
        <>
            <CommentBox _id={props._id} />
            {state.length > 0 && <List
                dataSource={state}
                header={`${state.length} ${state.length > 1 ? 'Comments' : 'Comment'}`}
                itemLayout="horizontal"
                renderItem={c => <Comment content={c.comment?.text}
                    author={c.user?.name}
                    avatar={c.user?.photo}
                    datetime={c.comment?.timestamp}
                    actions={createAction(c.comment?.likes, c.comment?.dislikes, c.comment?.likers, c.comment?.dislikers, c.comment?._id, c.user?._id)} />}
            />}
        </>
    );
}

export default Discussion;