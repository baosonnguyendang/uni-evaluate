import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect  } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-page"
import UserPage from './components/user/user-page'
import axios from 'axios'

import { checktoken } from './actions/authActions';
import { useDispatch, useSelector } from 'react-redux'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )} />
)

function App() {
  axios.defaults.baseURL = 'https://university-evaluation.herokuapp.com';
  const dispatch = useDispatch()
  const isLogin = useSelector(state => state.auth.isAuthenticated);
  useEffect(() => {
    dispatch(checktoken());
  }, []);
  return (
    <Router >
        <Route path="/" exact component={SignInSide} />
        { isLogin ? (<>
          <Route path="/admin" component={Dashboard} />
          <PrivateRoute path="/user" component={UserPage} />
          </>
        ): (<Redirect to='/' />)}
    </Router>
  );
}

export default App;