import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import AppBar from './user-appbar';
import Main from './user-main';
import Info from './user-info';
import TableEvaluation from './element/user-table';
import FormList from './user-form-list';
import Profile from './user-profile/user-profile';
import Evaluation from './user-evaluation';

import EmployeeList from './user-head-unit/user-employee-list';
import EmployeeForm from './user-head-unit/user-employee-form';

import NotFound from '../common/NotFound'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';

const UserPage = () => {
  let isLogged = localStorage.getItem('token') && localStorage.getItem('role')
  return (
    <>
      {isLogged ? (localStorage.getItem('role') === 'admin' && <Redirect to='/admin/user' />) : <Redirect to='/' />}
      <AppBar />
      <Container>
        <Switch>
          <Route path='/user/profile' >
            <Profile />
          </Route>
          <Route path='/user' exact>
            <Evaluation />
          </Route>
          <Route path='/user/evaluate/:id' exact>
            <FormList />
          </Route>
          <Route path='/user/evaluate/:id/:id1' exact>
            <TableEvaluation />
          </Route>
          <Route path='/user/evaluate/:id/:id1/:id2' exact>
            <EmployeeList />
          </Route>
          <Route path='/user/evaluate/:id/:id1/:id2/:id3' exact>
            <EmployeeForm />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Container>
    </>
  )
}

export default UserPage
