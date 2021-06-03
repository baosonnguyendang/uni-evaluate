import React from 'react';
import { Redirect } from 'react-router';
import AppBar from './user-appbar';
import TableEvaluation from './element/user-table';
import FormList from './user-form-list';
import Profile from './user-profile/user-profile';
import Evaluation from './user-evaluation';

import EmployeeList from './user-head-unit/user-employee-list';
import EmployeeForm from './user-head-unit/user-employee-form';

import CouncilUnitList from './hddg/user-hddg-list';
import CouncilEmployeeList from './hddg/user-hddg-employeelist';
import CouncilEmployeeForm from './hddg/user-hddg-employeeform';

import NotFound from '../common/NotFound'

import { Route, Switch } from 'react-router-dom';

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
          <Route path='/user/evaluate/:id' exact>
            <FormList />
          </Route>
          <Route path='/user/evaluate/:id/:id1' exact>
            <TableEvaluation />
          </Route>
          <Route path='/user/evaluate/:id/:id1/hddg' exact>
            <CouncilUnitList />
          </Route>
          <Route path='/user/evaluate/:id/:id1/:id2' exact>
            <EmployeeList />
          </Route>
          <Route path='/user/evaluate/:id/:id1/hddg/:id2' exact>
            <CouncilEmployeeList />
          </Route>
          <Route path='/user/evaluate/:id/:id1/:id2/:id3' exact>
            <EmployeeForm />
          </Route>
          <Route path='/user/evaluate/:id/:id1/hddg/:id2/:id3' exact>
            <CouncilEmployeeForm />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
    </>
  )
}

export default UserPage
