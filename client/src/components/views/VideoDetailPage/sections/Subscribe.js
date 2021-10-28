import React, {useEffect, useState} from 'react'
import Axios from 'axios';

//faorite이든 subscribe이든 처음에는 내가 영상 올린사람을 구독했는지 안했는지를 클릭할때마다 state에 boolean을 줘서 확인했는데
//이러면 같은 아이디로 다른 영상 페이지에서 구독 클릭하면 또 올라간다. 근본적인 방법은 model array.length가 0인지 아닌지로 확인

function Subscribe(props) {

    const [subscribeState, setsubscribeState] = useState(false);
    const [subscribeNumber, setsubscribeNumber] = useState(0);
    const [isyoutuber, setisyoutuber] = useState(true);

    useEffect(() => {

        let variable = {
            userTo: props.subscribedId //구독을 받은 사람의 id
        }
    
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setsubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수를 가져오는데 실패했습니다')
                }
            })


        let variables = {
            userTo: props.subscribedId, //구독을 받은 사람의 id
            userFrom: localStorage.getItem("userId")
        }

        Axios.post('/api/subscribe/subscribestate', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    setsubscribeState(response.data.SubscribeState)
                } else {
                    alert('구독 상태 데이터를 가져오는데 실패했습니다')
                }
            })
        
        const youtuber = () => {

            let userTo = props.subscribedId;
            let userFrom = localStorage.getItem("userId");

            if(userTo == userFrom){
                setisyoutuber(false);
            } else {
                setisyoutuber(true);
            }

            console.log(isyoutuber); //항상 기본값만 나옴 왜일까? 
        }

        youtuber();

    }, [])

    const SubscribeClick = () => {

        let variables = {
            userFrom: localStorage.getItem('userId'), //구독한 사람의 id
            userTo: props.subscribedId //구독을 받은 사람의 id
        }
      
        if(!subscribeState){
            
            Axios.post('/api/subscribe/addsubscribe', variables)
                .then(response => {
                    if(response.data.success){
                        console.log(response.data);
                        setsubscribeNumber(subscribeNumber + 1);
                        setsubscribeState(!subscribeState)
                    } else {
                        alert('구독 정보를 추가하는데 실패했습니다.')
                    }
                })
        } else {
            Axios.post('/api/subscribe/removesubscribe', variables)
                .then(response => {
                    if(response.data.success){
                        console.log(response.data);
                        setsubscribeNumber(subscribeNumber - 1);
                        setsubscribeState(!subscribeState)
                    } else {
                        alert('구독 정보를 추가하는데 실패했습니다.')
                    }
                })
        }       
    }

    

    

    return (
        
        <div>
            {isyoutuber ?
                <button
                    style={{
                        
                        backgroundColor: `${subscribeState ? 'gray' : '#CC0000'}`, borderRadius: '4px', marginLeft: '70px',
                        color: 'white', padding: '10px 16px', borderWidth: '0',
                        fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase',
                        position: 'relative', left: '8px'
                    }}
                    onClick={SubscribeClick}
                >
                    {subscribeState ? `${subscribeNumber} 구독중` : `${subscribeNumber} 구독`} 
                </button>
            : <div></div>}
        </div>
        
    )
}

export default Subscribe
