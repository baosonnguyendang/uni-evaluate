import React, { useEffect } from 'react'
import { Redirect } from 'react-router'
import AppBar from './user-appbar'
import Main from './user-main'
import Info from './user-info'
import TableEvaluation from './element/user-table'
import Profile from './user-profile'
import Evaluation from './user-evaluation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const UserPage = () => {
    let isLogged = localStorage.getItem('token') && localStorage.getItem('role')
    return (
        <>
        {isLogged ? (localStorage.getItem('role') === 'admin' && <Redirect to='/admin/user' />) : <Redirect to='/' />}
        <AppBar />
        <Switch>
            <Route path='/user/profile' >
                <Profile />
            </Route>
            <Route path='/user' exact>
            <Evaluation />
            </Route>
        </Switch>
        </>
    )
}

export default UserPage
