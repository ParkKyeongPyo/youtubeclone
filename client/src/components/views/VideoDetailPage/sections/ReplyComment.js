import React, {useEffect, useState} from 'react';
import SingleComment from './SingleComment';


function ReplyComment(props) {


    const [replyNumber, setreplyNumber] = useState(0);
    const [replyValue, setreplyValue] = useState(false);

    useEffect(() => {

        let replyCommentNumber = 0;

        props.commentLists.map((Comments) => {
            
            if(Comments.responseTo === props.parentId){
                replyCommentNumber++
            }           
        })

        setreplyNumber(replyCommentNumber);

    }, [props.commentLists])


    const renderReplyComment = (parentId) => (

        props.commentLists.map((Commentss, index) => (
                               
               <React.Fragment>
                    {Commentss.responseTo === parentId &&
                        <div key={index} >
                            <SingleComment 
                                commentLists={Commentss} 
                                postId={props.postId}
                                commentSender={props.commentSender}
                                replyStateFunction={props.replyStateFunction}
                            />
                            <ReplyComment
                                commentLists={props.commentLists} 
                                postId={props.postId}
                                commentSender={props.commentSender}
                                parentId={Commentss._id}
                                replyState={props.replyState}
                                replyStateFunction={props.replyStateFunction}
                            />
                        </div>
                    }
                </React.Fragment>
        ))
    )


    const onHandleChange = () => {
        setreplyValue(!replyValue);
        console.log(replyValue);
    }


    return (
        <div style={{ paddingLeft: '44px', position: 'relative', bottom: `${props.replyState ? 0 : '21px'}`}}>
            {replyNumber > 0 ?
            
                replyValue ?
                
                <p style={{ fontSize: '14px', margin: 0, color: 'gray'}} onClick={onHandleChange}>
                    {replyNumber}개 답글 숨기기
                </p> 
                : 
                <p style={{ fontSize: '14px', margin: 0, color: 'gray'}} onClick={onHandleChange}>
                    {replyNumber}개 답글 보기
                </p>                
            : null
            }
            {replyValue && renderReplyComment(props.parentId)}
        </div>
    )
}

export default ReplyComment
