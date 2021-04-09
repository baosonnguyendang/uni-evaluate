import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import Dashboard from "./components/admin/admin-navbar"
import Dashboard2 from './components/user/user-navbar'

function App() {
  return (
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
  );
}

export default App;