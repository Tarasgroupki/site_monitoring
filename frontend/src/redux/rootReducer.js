import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { linkReducer } from "./linkReducer";
import { imgReducer } from "./imgReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    links: linkReducer,
    avatar: imgReducer
});
