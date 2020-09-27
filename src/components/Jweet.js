import { dbService, storageService } from 'fbase'
import React, { useState } from 'react'

const Jweet = ({jweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false) //Editing mode or not
    const [newJweet, setNewJweet] = useState(jweetObj.text)
    const onDeleteClick = async () => {
        const CheckDelete = window.confirm("Are you sure you want to delete this Jweet?")
        if(CheckDelete) {
            await dbService.doc(`Jweets/${jweetObj.id}`).delete();
            await storageService.refFromURL(jweetObj.attachmentUrl).delete();
        }    
    }
    const toggleEditing = () => setEditing((prev) => !prev)
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(jweetObj, newJweet);
        await dbService.doc(`Jweets/${jweetObj.id}`).update({
            text:newJweet
        })
        setEditing(false) // we're not in editing mode anymore
    }
    const onChange = (e) => {
        const {target: {value}} = e;
        setNewJweet(value);
    }
    return(
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input 
                        type="text"
                        placeholder="Edit your Jweet"
                        value={newJweet}
                        required
                        onChange={onChange}
                    />
                    <input type="submit" value="Update Jweet"/>
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
                ):(
                <>
                    <h4>{jweetObj.text}</h4>
                    {jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} width="50px" height="50px" />}
                    {isOwner && (
                        <>
                        <div>
                        <button onClick={toggleEditing}>Edit</button>
                        <button onClick={onDeleteClick}>Delete</button>
                        </div>
                    </>    
                )}
            </>
            )}
        </div> 
    )
}

export default Jweet
