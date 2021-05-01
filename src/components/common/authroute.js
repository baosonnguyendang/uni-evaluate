import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const AuthRoute = props => {
    const { isAuthenticated, role } = props;
    console.log(isAuthenticated, role)
    if (role === "admin" && isAuthenticated) return <Redirect to="/admin" />;
    else if (role === "" && !isAuthenticated) return <Redirect to="/" />;
    else if (role === 'user' && isAuthenticated) return <Redirect to="/user" />
    return <Route {...props} />;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    role: state.auth.role
});

export default connect(mapStateToProps)(AuthRoute);