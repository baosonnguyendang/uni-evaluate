import axios from 'axios';
import { returnErrors, clearErrors } from './errorActions';
import {
  USER_LOADED,
  USER_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS
} from './types';
// Check token & load user
import jwt from 'jsonwebtoken'
import moment from 'moment'
export const checktoken = () => (dispatch, getState) => {
  const token = getState().auth.token;

  if ( token ){
    if (moment(jwt.decode(token).exp * 1000).isBefore(Date.now())) {
      dispatch({type: LOGOUT_SUCCESS})
    } 
    else
    {
      dispatch({type: USER_LOADED})
    }
  }
};


// Login User
export const login = ({ email, password }) => (dispatch) => {
  // User loading
  dispatch({ type: USER_LOADING });

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post('/auth/signin', body, config)
    .then(res =>{
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
      dispatch(clearErrors())
    }
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.message,'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};

