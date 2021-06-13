import { SNACKBAR_SUCCESS, SNACKBAR_ERROR, SNACKBAR_CLEAR } from './types';

// RETURN SUCCESS NOTIFY
export const showSuccessSnackbar = (message) => {
  return {
    type: SNACKBAR_SUCCESS,
    payload: { message }
  };
};

// RETURN ERROR NOTIFY
export const showErrorSnackbar = (message) => {
    return {
      type: SNACKBAR_ERROR,
      payload: { message }
    };
  };

// CLEAR NOTIFY
export const clearSnackbar = () => {
  return {
    type: SNACKBAR_CLEAR,
  };
};