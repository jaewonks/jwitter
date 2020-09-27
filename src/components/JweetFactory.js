import React from 'react'
import { dbService, storageService } from 'fbase'

function JweetFactory({userObj}) {

    const onSubmit = async (e) => {
        e.preventDefault()
        let attachmentUrl=""
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
    )
}

export default JweetFactory
