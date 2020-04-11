import { AUTHENTICATE, UNAUTHENTICATE, LINK, TITLE, UNLINK, UNTITLE, SET_MAINIMG, UNSET_MAINIMG, SET_USERID, UNSET_USERID } from "./types";

export function Authenticate(token = '') {
    return {
        type: AUTHENTICATE,
        payload: token
    }
}

export function UnAuthenticate() {
    return {
        type: UNAUTHENTICATE,
        payload: ''
    }
}

export function SetUserId(userId) {
   return {
       type: SET_USERID,
       payload: userId
   }
}

export function UnsetUserId() {
    return {
        type: UNSET_USERID,
        payload: ''
    }
}

export function Link(link) {
    return {
        type: LINK,
        payload: link
    }
}

export function UnLink() {
    return {
        type: UNLINK,
        payload: ''
    }
}

export function Title(title) {
    return {
        type: TITLE,
        payload: title
    }
}

export function UnTitle() {
    return {
        type: UNTITLE,
        payload: ''
    }
}

export function SetMainImg(avatar) {
    return {
        type: SET_MAINIMG,
        payload: avatar
    }
}

export function UnSetMainImg() {
    return {
        type: UNSET_MAINIMG,
        payload: ''
    }
}
