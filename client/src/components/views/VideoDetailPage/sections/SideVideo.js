import React, {useEffect, useState} from 'react'
import VideoDetailPage from '../VideoDetailPage';
import Axios from 'axios';

function SideVideo() {

    const [video, setVideo] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/sidevideo', {writer: localStorage.getItem('userId')})
        .then(response => {
            if(response.data.success){
                setVideo(response.data.info);
                console.log(response.data);
            } else {
                alert('사이드 비디오에서 모든 비디오 정보를 가져오는데 실패했습니다.')
            }
        })
    }, [])

    const renderCards = video.map((Video, index) => {

        var minutes = Math.floor(Video.duration / 60);
        var seconds = Math.floor((Video.duration - minutes * 60));

        return(
            <div style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem'}} key={index}>
                <div style={{ width: '40%', marginRight: '1rem'}}>
                    <a href={`/video/post/${Video._id}`}>
                        <img style={{ width: '100%', height: '100%'}} src={`http://localhost:6001/${Video.thumbnail}`} alt="thumbnail"/>
                    </a>
                </div>
                <div style={{ width: '50%'}}>
                    <a href={`/video/post/${Video._id}`} style={{color: 'gray'}}>
                        <span style={{ fontSize: '1rem', color: 'black'}}>{Video.title}</span><br />
                        <span>{Video.writer.name}</span><br />
                        <span>{Video.views} views</span><br />
                        <span>{minutes} : {seconds}</span><br />
                    </a>
                </div>
            </div>
    )})

    return (
        <React.Fragment> {/* renderCards를 왜 부모태그로 감싸야 하지? */}           
            <div style={{ marginTop: '3rem'}}>    
                {renderCards}       
            </div>    
        </React.Fragment>
      
        
    )
}

export default SideVideo
