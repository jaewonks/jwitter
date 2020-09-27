import { authService, firebaseInstance } from 'fbase';
import React, { useState } from 'react'

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [err, setErr] = useState("");
    const onChange = (e) => {
        //console.log(e.target);
        //console.log(e.target.name);
        const {target: {name, value}} = e; //이벤트에서 value와 name을 가져온다
        //console.log(value);
        if(name === 'email'){
            setEmail(value)
        } else if(name==='password'){
            setpassword(value)
        }
    }
    const onSumit = async (e) => {
        e.preventDefault();
        try {
            //let data;
            if(newAccount){ //이메일과 패스워드를 받는다
                await authService.createUserWithEmailAndPassword(email, password);
            } else {
                await authService.signInWithEmailAndPassword(email, password);
            } 
            //console.log(data)
        } catch(err) {
            setErr(err.message)
        }
    }
        const toggleAccount = () => setNewAccount((prev) => !prev);
        const onSocialClick = async (e) => {
            //console.log(e.target)
            //console.log(e.target.name)
            const { target:{name}
                    } = e;
                let provider;
                if(name === "google"){
                    provider = new firebaseInstance.auth.GoogleAuthProvider();
                } else if (name === "github"){
                    provider = new firebaseInstance.auth.GithubAuthProvider();
                }
                    await authService.signInWithPopup(provider);
                //console.log(data);
        }
        return (
            <div>
            <form onSubmit={onSumit}>
                <input 
                    name='email'
                    type='text' 
                    placeholder='Email' 
                    required 
                    value={email}
                    onChange={onChange}   
                    /> 
                <input 
                    name='password'
                    type='password' 
                    placeholder='Password' 
                    required 
                    value={password}
                    onChange={onChange}
                    />
                <input type='submit' value={newAccount ? "Create Account" : "Sign In"}  
                />
                {err}
            </form>
                 <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span> 
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
        )
};

export default Auth
