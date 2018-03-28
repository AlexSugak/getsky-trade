import {
    LOGIN_USER_RESPONSE_OK,
    LOGIN_USER_RESPONSE_ERROR,
    LOGOUT_USER,
} from './actions'

const loginInitialState = {
    authorized: false,
};

export default (state = loginInitialState, action) => {
    switch (action.type) {
        case LOGIN_USER_RESPONSE_OK:
            return { ...state, authorized: true };
        case LOGIN_USER_RESPONSE_ERROR:
            return { ...state, authorized: false };
        case LOGOUT_USER:
            return { ...state, authorized: false };
        default:
            return state
    }
};
