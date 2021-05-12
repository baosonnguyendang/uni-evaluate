import React, { useEffect } from 'react'
import { Redirect } from 'react-router'
import AppBar from './user-appbar'
import Main from './user-main'
import Info from './user-info'
import TableEvaluation from './element/user-table'
import Profile from './user-profile/user-profile'
import Evaluation from './user-evaluation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from '@material-ui/core'
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
            <Container>
            <Route path='/user' exact>
                <Evaluation />
            </Route>
            <Route path='/user/evaluate/:id' exact>
                <TableEvaluation />
            </Route>
            </Container>
        </Switch>
        </>
    )
}

export default UserPage
