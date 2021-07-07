import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-page"
import UserPage from './components/user/user-page'
import axios from 'axios'

import { checktoken } from './actions/authActions';
import { useDispatch, useSelector } from 'react-redux'
import Toast from './components/common/Snackbar'
import NotFound from './components/common/NotFound'
import ForbiddenPage from './components/common/ForbiddenPage'
import Modal from './components/common/Modals/Modal'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  axios.defaults.baseURL = 'https://university-evaluation.herokuapp.com';
  axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

  useEffect(() => {
    dispatch(checktoken());
  }, [dispatch]);
  return (
    <Router >
      <Toast />
      <Modal />
      <Switch>
        <Route path="/" exact component={SignInSide} />
        <Route path="/admin" component={Dashboard} />
        <Route path="/user" component={UserPage} />
        <Route path="/forbidden" component={ForbiddenPage} />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;