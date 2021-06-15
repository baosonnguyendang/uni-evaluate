import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, useHistory } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-page"
import UserPage from './components/user/user-page'
import axios from 'axios'

import { checktoken } from './actions/authActions';
import { useDispatch, useSelector } from 'react-redux'
import Toast from './components/common/Snackbar'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  axios.defaults.baseURL = 'https://university-evaluation.herokuapp.com';
  axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}

  useEffect(() => {
    dispatch(checktoken());
  }, [dispatch]);
  return (
    <Router >
      <Toast />
      <Route path="/" exact component={SignInSide} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/user" component={UserPage} />
    </Router>
  );
}

export default App;