import React from 'react'
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Auth from 'routers/Auth'
import Home from 'routers/Home'
import Profile from 'routers/Profile'
import Navigation from 'components/Navigation'

const AppRouter = ({refreshUser,isLoggedIn,userObj}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Switch>
                {isLoggedIn ? 
                <>
                <Route exact path='/'>
                    <Home userObj={userObj} /> {/*userObj props를 전달/ parsing down from Home.js*/}
                </Route> 
                <Route exact path='/profile'>
                    <Profile userObj={userObj} refreshUser={refreshUser}/>
                </Route>
                <Redirect from='*' to='/' /> 
                </>:( 
                    <>
                    <Route exact path='/'>
                        <Auth />
                    </Route>
                    <Redirect from='*' to='/' /> 
                    </>
                    )}
            </Switch>
        </Router>
    )
}

export default AppRouter