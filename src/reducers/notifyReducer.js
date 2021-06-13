
import { SNACKBAR_SUCCESS, SNACKBAR_ERROR, SNACKBAR_CLEAR } from '../actions/types';

const initialState = {
    message: '',
    type: null,
    open: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SNACKBAR_SUCCESS:
            return {
                ...state,
                open: true,
                type: 'success',
                message: action.payload.message
            };
        case SNACKBAR_ERROR:
            return {
                ...state,
                open: true,
                type: 'error',
                message: action.payload.message
            };
        case SNACKBAR_CLEAR:
            return {
                ...state,
                open: false
            };
        default:
            return state;
    }
}