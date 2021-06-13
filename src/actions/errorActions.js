import { GET_ERRORS, CLEAR_ERRORS } from './types';

// RETURN ERRORS
export const returnErrors = (msg, type = null, open) => {
  return {
    type: GET_ERRORS,
    payload: { msg, type, open }
  };
};

// CLEAR ERRORS
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};