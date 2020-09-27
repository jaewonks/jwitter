import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false) //false, 아직은 초기화되지 않음
  const [isLoggedIn, setIsLoggedIn] = useState(false) //유저의 로그인 여부를 알수있다
  const [userObj, setUserObj] = useState(null)
  
    useEffect(() => {
      authService.onAuthStateChanged((user) => { //로그인한 유저를 받는다
        //console.log(user)
        if(user){
          setIsLoggedIn(true)
          setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args)
          }) //userObject에 우리가 받은 유저를 저장한다.
        } else {
          setIsLoggedIn(false)
        } //로그인을 했거나 하지않았거나
        setInit(true) //데이터베이스를 초기화한다.
      });
    }, []);
    const refreshUser = () => {
      const user = authService.currentUser;
      setUserObj({
        displayName: user.displayName,
        uid: user.uid,
        updateProfile: (args) => user.updateProfile(args)
      })
    }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initalizing..."}
      <footer><p>&copy; {new Date().getFullYear()} Jwitter</p></footer>
    </>  
  )
}

export default App;
