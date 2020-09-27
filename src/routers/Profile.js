import { authService } from 'fbase'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

function Profile({refreshUser, userObj}) {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
    const onSignOutClick = () => {
        authService.signOut();
        history.push('/');

    }
    const onChange = (e) => {
        const {target: {value}} = e;
        setNewDisplayName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName) { 
            //변경된 사항이 없으면 업데이트하지 않는다
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser()
        } 
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange} 
                    type="text" 
                    placeholder="display name" 
                    value={newDisplayName}
                />
                <input type="submit" placeholder="Update Profile" />
            </form>
            <button onClick={onSignOutClick}>Sign Out</button>        
        </>
    )
}

export default Profile