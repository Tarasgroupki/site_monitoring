import {SET_MAINIMG, UNSET_MAINIMG} from "./types";

const initialState = {
    avatar: ''
};

export const imgReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MAINIMG:
            return {...state, avatar: state.avatar.concat(action.payload)};
        case UNSET_MAINIMG:
            return state = initialState;
        default: return state;
    }
};
