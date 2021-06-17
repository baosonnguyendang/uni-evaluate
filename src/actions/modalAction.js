import {  MODAL_CUSTOM, MODAL_CLEAR } from './types';

// RETURN MODAL SÁCH BÁO
export const showModal = (submit, type) => {
  return {
    type: MODAL_CUSTOM,
    payload: { submit, type }
  };
};


// CLEAR NOTIFY
export const clearModal = () => {
  return {
    type: MODAL_CLEAR,
  };
};