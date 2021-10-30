import React, {useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import {useSelector} from 'react-redux';

const {TextArea} = Input;

function SingleComment(props) {

    const [openReply, setopenReply] = useState(false);
    const [commentValue, setcommentValue] = useState('');
    const user = useSelector(state => state.user);

    const onClickReplyOpen = () => {
        setopenReply(!openReply);
        props.replyStateFunction(!openReply)
    }

    const actions = [ //[]는 무슨 문법이지?
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">답글</span>
    ]

    const onHanleChange = (event) => {
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        let variables = {
            writer: user.userData._id,
            content: commentValue,
            postId: props.postId,
            responseTo: props.commentLists._id
        }
        
        Axios.post('/api/comment/sendsinglecomment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setcommentValue('');
                    props.commentSender(response.data.info);
                } else {
                    alert('comment state를 DB에 보내는데 실패했습니다')
                }
            })
            
            
    }
    

    return (
        <div>
            <Comment
                actions={actions}
                author={props.commentLists.writer.name}
                avatar={<Avatar src={props.commentLists.writer.image} alt={'Userimage'} />}
                content={props.commentLists.content}
            />
        {openReply &&
            <form style={{ display: 'flex', paddingLeft: '44px' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '80%', borderRadius: '5px' }}
                    onChange={onHanleChange}
                    value={commentValue}
                    placeholder="코멘트를 입력해주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        }
        </div>
    )
}

export default SingleComment
