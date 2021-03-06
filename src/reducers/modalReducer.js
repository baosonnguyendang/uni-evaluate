/* eslint-disable import/no-anonymous-default-export */

import { MODAL_CUSTOM, MODAL_CLEAR } from '../actions/types';

const initialState = {
    submit: null,
    type: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case MODAL_CUSTOM:
            return {
                ...state,
                ...action.payload
            };
        case MODAL_CLEAR:
            return {
                submit: null,
                type: null,
            };
        default:
            return state;
    }
}