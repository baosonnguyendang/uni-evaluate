import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-navbar"
import Dashboard2 from './components/user/user-navbar'
import axios from 'axios'
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions';

function App() {
  axios.defaults.baseURL = 'https://university-evaluation.herokuapp.com';
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
    <Router>
      <div>
        {/* <Navbar /> */}
        <Route path="/" exact component={SignInSide} />
        <Route path="/admin" component={Dashboard} />
        <Route path="/user" component={Dashboard2} />
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