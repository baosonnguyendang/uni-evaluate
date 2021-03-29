import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import SignInSide from "./components/signin"
import StickyFooter from "./components/dashboard"
import Dashboard from "./components/dashboard-admin-navbar"
import BasicTable from "./components/dashboard-admin-user"

function App() {
  return (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Route path="/" exact component={SignInSide} />
        <Route path="/dashboard" component={Dashboard} />
        {/* <Route path="/dashboard/user" component={BasicTable} /> */}
        {/* <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} />
        <Route path="/user" component={CreateUser} /> */}
      </div>
    </Router>
  );
}

export default App;