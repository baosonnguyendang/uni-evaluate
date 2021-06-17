  
import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import notifyReducer from './notifyReducer';
import modalReducer from './modalReducer';

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  notify: notifyReducer,
  modal: modalReducer,
});