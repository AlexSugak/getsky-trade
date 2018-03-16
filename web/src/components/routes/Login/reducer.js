import { LOGIN_USER_RESPONSE_OK } from './actions'

const loginInitialState = {
    authorized: false,
};

export default (state = loginInitialState, action) => {
    switch (action.type) {
        case LOGIN_USER_RESPONSE_OK:
            return { ...state, authorized: true };
        default:
            return state
    }
};
