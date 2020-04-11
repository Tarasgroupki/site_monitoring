import {AUTHENTICATE, UNAUTHENTICATE, SET_USERID, UNSET_USERID} from "./types";

const initialState = {
  auth: '',
  userId: ''
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
           return {...state, auth: state.auth.concat(action.payload)};
        case UNAUTHENTICATE:
           return state = initialState;
        case SET_USERID:
           return {...state, userId: state.userId.concat(action.payload)};
        case UNSET_USERID:
           return state = initialState;
        default: return state;
    }

};
