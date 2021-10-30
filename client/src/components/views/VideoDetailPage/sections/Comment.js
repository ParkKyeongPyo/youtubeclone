import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';


function Comment(props) {

    const [comment, setcomment] = useState('');
    const [replystate, setreplystate] = useState(false);

    const user = useSelector(state => state.user)

    const handleClick = (event) => {
        setcomment(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        let variables = {
            writer: user.userData._id,
            content: comment,
            postId: props.videoId
        }
        
        Axios.post('/api/comment/sendcomment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setcomment('');
                    props.commentSender([response.data.doc]);
                } else {
                    alert('comment state를 DB에 보내는데 실패했습니다')
                }
            })

    }

    const replyStateFunction = (reply) => {
        setreplystate(reply);
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map((Comment, i) => (
               
                (!Comment.responseTo &&
                    <React.Fragment key={i}>
                        <SingleComment 
                            commentLists={Comment} 
                            postId={props.videoId}
                            commentSender={props.commentSender}
                            replyStateFunction={replyStateFunction}
                        />
                        <ReplyComment
                            commentLists={props.commentLists} 
                            postId={props.videoId}
                            commentSender={props.commentSender}
                            parentId={Comment._id}
                            replyState={replystate}
                            replyStateFunction={replyStateFunction}
                        />
                    </React.Fragment>
                )

            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '80%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={comment}
                    placeholder="코멘트를 입력해주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment
