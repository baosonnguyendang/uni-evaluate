
import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
  msg: '',
  type: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        type: action.payload.type,
      };
    case CLEAR_ERRORS:
      return null;
    default:
      return state;
  }
}