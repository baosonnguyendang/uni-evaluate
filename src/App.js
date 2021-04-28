import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect  } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-page"
import UserPage from './components/user/user-page'
import axios from 'axios'
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions';


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )} />
)

function App() {
  axios.defaults.baseURL = 'https://university-evaluation.herokuapp.com';
  useEffect(() => {
    // store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
    <Router >
      <div>
        {/* <Navbar /> */}
        <Route path="/" exact component={SignInSide} />
        <Route path="/admin" component={Dashboard} />
        <PrivateRoute path="/user" component={UserPage} />
        {/* <Route path="/dashboard/user" component={BasicTable} /> */}
        {/* <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} />
        <Route path="/user" component={CreateUser} /> */}

      </div>
    </Router>
    </Provider>
  );
}

export default App;