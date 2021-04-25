import React from 'react'
import { Redirect } from 'react-router'
import AppBar from './user-appbar'
const UserPage = () => {
    let isLogged = localStorage.getItem('token') && localStorage.getItem('role')
    return (
        <>
        {
            isLogged ? (localStorage.getItem('role') === 'admin' && <Redirect to='/admin' />) : <Redirect to='/' />
        }
        <AppBar />
            
        </>
    )
}

export default UserPage
