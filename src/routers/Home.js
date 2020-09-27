import React, { useState, useEffect } from 'react'
import { dbService, storageService } from 'fbase'
import { v4 as uuidv4 } from 'uuid' //어떤 특별한 식별자를 랜덤으로 생성
import Jweet from 'components/Jweet'

const Home = ({userObj}) => { //home has a user object props
    //console.log(userObj);
    const [jweet, setJweet] = useState('');
    const [jweets, setJweets] = useState([]);
    const [attachment, setAttachment] = useState('')
    /*const getjweets = async() => {
        const dbJweets = await dbService.collection('Jweets').get(); //DB에서 모든것을 가져온다
        //console.log(dbJweets)
            dbJweets.forEach((doc) => {
                const jweetObject = {
                    ...doc.data(), //모든 데이터를 가진다(spread attribute)
                    id: doc.id     //아이디를 부여한다
                };
                setJweets(prev => [jweetObject, ...prev]) //배열-> 현재의 데이터에 이전 데이터를 붙여서 나열한다.
        });
    }   //각각의 state(jweets)에 있는 document.data*/
    useEffect(() => {
        //getjweets()
        //위의 코드에 비해 적게 render하는 코드
        dbService.collection("Jweets").onSnapshot((snapshot) => {
            const jweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setJweets(jweetArray);
        })
    }, []);
    const onSubmit = async (e) => {
        e.preventDefault()
        let attachmentUrl=''
        if(attachment !== ''){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment,'data_url'); //data와 data의 형식
            attachmentUrl = await response.ref.getDownloadURL()
        }
            const jweetObj = {
                text: jweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl
            }
        await dbService.collection("Jweets").add(jweetObj);
        setJweet('')
        setAttachment('')
    }
    const onChange = (e) => {
        const { target:{value} } = e;
        setJweet(value);
    };
    //각각의 state(jweets)에 있는 document.data를 화면에 뿌린다
    //console.log(jweets)
    const onFileChange = (e) => {
        //console.log(e.target.files);
        const {target: {files}} = e;
        const targetFile = files[0]; //모든 파일중 첫번째 파일 you can take many files as you want
        const reader = new FileReader(); //create the reader
        reader.onloadend = (finishede) => {
            const {currentTarget: {result}} = finishede;
            setAttachment(result);
        }
        reader.readAsDataURL(targetFile); //read file
    }
    const onClearAttachment = () => setAttachment(null)
    return (
        <div>
        <form onSubmit={onSubmit}>
            <input value={jweet} 
                   onChange={onChange} 
                   type='text' 
                   placeholder="What's your mind?" 
                   maxLength={120} 
            />
            <input type='file' accept='image/*' onChange={onFileChange} />
            <input type='submit' value='Jwitter' />
            
            {attachment && (
                <div>
                    <img src={attachment} width='50px' height='50px'/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
            </form>
            <div>  
                {jweets.map((jweet) => (
                    <Jweet 
                        key={jweet.id} 
                        jweetObj={jweet}
                        isOwner={jweet.creatorId === userObj.uid}    
                    />
             ))}
            </div>
        </div>  
    );
}

export default Home;
