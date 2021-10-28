import React, {useEffect, useState} from 'react'
import { withRouter } from "react-router-dom";
import {Row, Col, List, Avatar, Card} from 'antd';
import Axios from 'axios';
import SideVideo from './sections/SideVideo';
import Subscribe from './sections/Subscribe';
import Comment from './sections/Comment';


function VideoDetailPage(props) {

    const videoId = props.match.params.videoId;
    const [video, setvideo] = useState([]);
    const [comment, setcomment] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/videodetailpage', { videoId: videoId })
            .then(response => {
                if(response.data.success){
                    setvideo(response.data.info);
                    console.log(response.data);
                } else {
                    alert('비디오 디테일 페이지에서 데이터를 가져오는데 실패했습니다.')
                }
            })
        
        Axios.post('/api/comment/allcommentget', {postId: videoId})
        .then(response => {
            if(response.data.success){
                console.log(response.data);
                setcomment(response.data.comment);
            } else {
                alert('댓글 모델에서 모든 댓글을 가져오는데 실패했습니다.')
            }
        })
    }, [])

    const commentSender = (newComment) => {
        setcomment(comment.concat(newComment));
    }
    


    if(video.writer){            
        return(
            <Row>
                 <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem'}}>
                         <video style={{ width: '100%'}} src={`http://localhost:6001/${video.filePath}`} controls></video>
    
                    {video ?    
                        <List.Item 
                          actions={[<Subscribe //[]는 왜 쓰는 거지?
                          subscribedId={video.writer._id}
                        />]}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={video.writer.image}/>
                                } 
                                title={video.writer.name}
                                description={video.description}
                            />
                        </List.Item> : "NO LIST"   }                    
                        <Comment 
                        videoId={videoId}
                        commentSender={commentSender}
                        commentLists={comment}
                        />                    
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                   <SideVideo/>
                </Col>
            </Row>)                  
    } else {
               return <div>로딩중...</div>
            }
        
    
}

export default withRouter(VideoDetailPage) 
