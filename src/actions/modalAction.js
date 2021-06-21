import {  MODAL_CUSTOM, MODAL_CLEAR } from './types';

// RETURN MODAL SÁCH BÁO
export const showModal = (submit, type, data) => {
  return {
    type: MODAL_CUSTOM,
    payload: { submit, type, data }
  };
};


// CLEAR NOTIFY
export const clearModal = () => {
  return {
    type: MODAL_CLEAR,
  };
};