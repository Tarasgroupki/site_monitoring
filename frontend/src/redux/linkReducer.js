import {LINK, TITLE, UNLINK, UNTITLE} from "./types";

const initialState = {
    link: '',
    title: ''
};

export const linkReducer = (state = initialState, action) => {
    switch (action.type) {
        case LINK:
            return {...state, link: state.link.concat(action.payload)};
        case UNLINK:
            return state = initialState;
        case TITLE:
            return {...state, title: state.title.concat(action.payload)};
        case UNTITLE:
            return state = initialState;
        default: return state;
    }
};
