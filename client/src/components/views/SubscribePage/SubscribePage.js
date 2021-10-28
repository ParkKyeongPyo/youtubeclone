import { withRouter } from "react-router-dom";
import React, {useEffect, useState} from 'react'
import {Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from 'moment';

const {Title} = Typography;
const {Meta} = Card;


function SubscribePage(props) {
    
    const [video, setvideo] = useState([]);

    useEffect(() => {

        Axios.post('api/subscribe/getsubscribed', {userFrom: localStorage.getItem('userId')})
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setvideo(response.data.SubscribeVideo);
                    
                } else {
                    alert("유저 구독자 비디오 및 데이터를 가져오는데 실패했습니다.")
                }
            })
    }, [])

    const renderCards = video.map((Video, index) => { 
        
        //Math.floor() 함수는 주어진 숫자와 같거나 작은 정수 중에서 가장 큰 수를 반환합니다.
        console.log(typeof(Video.duration))
        var minutes = Math.floor(Video.duration / 60);
        var seconds = Math.floor((Video.duration - minutes * 60))

        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/post/${Video._id}`}>
                <div style={{ position: 'relative'}}>
                    {Video.thumbnail ?
                        <img  style={{ width: '100%' }} src={`http://localhost:6001/${Video.thumbnail}`}/> : "no image"}
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br/>
            <Meta
                avatar={
                    <Avatar src={Video.writer.image}/>
                }
                title={Video.title}
                description=""
            />
            <span>{Video.writer.name}</span>
            <span style={{ marginLeft : '3rem'}}>{Video.views} views</span> - <span>{moment(Video.createAt).format("MMM Do YY")}</span>
        </Col>
    })
                        
    return (
        <div style={{ width: '85%', margin: '3rem auto'  }}> {/* margin에 두가지 값이 있을 경우 첫번째는 위아래 두번째는 좌우, auto는 양쪽을 동일하게 설정 */}
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
  
}

export default withRouter(SubscribePage)
