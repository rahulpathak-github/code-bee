import React from 'react';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";
import { useState } from 'react';


const { TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'Comments' : 'Comment'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

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


function Discussion(props) { // pros -> courseItem id
    const [state, setState] = useState({ comments: [], submitting: false, value: "" });


    async function handleSubmit() {
        if (!state.value) {
            return;
        }

        setState({ ...state, submitting: true });

        // await socket.send(state.value);

        setState({
            submitting: false,
            value: '',
            comments: [
                ...state.comments,
                {
                    author: 'Han Solo',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: <p>{state.value}</p>,
                    datetime: moment().fromNow(),
                },
            ],
        });
    }

    return (
        <>
            <Comment
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                }
                content={
                    <Editor
                        onChange={e => setState({ ...state, value: e.target.value })}
                        onSubmit={handleSubmit}
                        submitting={state.submitting}
                        value={state.value}
                    />
                }
            />
            {state.comments.length > 0 && <CommentList comments={state.comments} />}
        </>
    );
}

export default Discussion;
