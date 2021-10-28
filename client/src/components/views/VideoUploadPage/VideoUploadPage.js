import React, {useState} from 'react'
import { withRouter } from "react-router-dom";
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import { FaFileExcel } from 'react-icons/fa';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import  {useSelector} from 'react-redux';


const {TextArea} = Input;
const {Title} = Typography; // {}는 왜 쓴거지? ->Typography 기능이 여러개인 경우?

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets& Animals"}
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescrioption] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState(0);
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const videoTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }

    const DescriptionChange = (e) => {
        setDescrioption(e.currentTarget.value);
    }

    const PrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }

    const CategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }

    const onDrop = (files) => {

        let formData = new FormData;
        const config = {
            header: { 'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        console.log(files)

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => { // 화살표 함수 {}에서 return이 없어도 되나?
                if(response.data.success){

                    console.log(response.data);
                    setFilePath(response.data.url);


                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    
                    // url 앞에 http://localhost:3000이 생략되있기 때문에 반드시 앞에 /를 붙여야 한다.
                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success){
                                console.log(response.data);
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url);
                            } else {
                                alert("썸네일 생성에 실패했습니다")
                            }
                        })




                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
        })
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            thumbnail: ThumbnailPath,
            duration: Duration
        }

        Axios.post('/api/video/uploadtoDB', variables)
            .then(response => {
                if(response.data.success){
                    message.success("업로드를 성공했습니다")

                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000);

                } else {
                    alert('업로드 데이터를 저장하는데 실패했습니다.')
                }
            })
          
    }
    
     /*The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.

    For example, this can be useful when:

    Clicking on a "Submit" button, prevent it from submitting a form
    Clicking on a link, prevent the link from following the URL
    Note: Not all events are cancelable. Use the cancelable property to find out if an event is cancelable.

    Note: The preventDefault() method does not prevent further propagation of an event through the DOM. Use the stopPropagation() method to handle this.*/

    return (
        <div style={{ maxWidth: '750px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}> {/* form 태그 안에서 form전송을 하기 전에 입력된 데이터의 유효성을 체크하는 이벤트 */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}
                    
                    <Dropzone
                        onDrop={onDrop} 
                        multiple={false}
                        maxSize={100000000000000}
                    >
                        {({ getRootProps, getInputProps}) => (//Q.() => () 는 함수인가 뭐지? A.화살표 함수에서 마지막 ()는 return문을 쓰지 않아도 ()안에 있는 것이 자동으로 return된다. 그러나 {}는 반드시 return을 써야만 return된다.
                            <div style={{width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{ fontSize: '3rem'}}/>
                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    <div>
                        <img src={`http://localhost:6001/${ThumbnailPath}`} alt="Thumbnail" />
                    </div>
                </div>

                <br />
                <br />

                <label>Title</label>
                <Input
                    onChange={videoTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />

                <label>Description</label>
                <TextArea
                    onChange={DescriptionChange}
                    value={Description}
                />

                <br />
                <br />
                
                <select onChange={PrivateChange}>
                    {PrivateOptions.map((items, index) => (
                        <option key={index} value={items.value}>{items.label}</option>
                    ))}
                </select>

                <br />
                <br />
                
                <select onChange={CategoryChange}>
                    {CategoryOptions.map((items, index) => (
                        <option key={index} value={items.value}>{items.label}</option>
                    ))}
                </select>

                <br />
                <br />
                
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form> 
        </div>
    )
}

export default withRouter(VideoUploadPage)
