import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_RESPONSE_OK,
    REGISTER_USER_RESPONSE_ERROR
} from './actions';

export const initialState = {
    requesting: true,
    errors: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return { ...state, requesting: true };
        case REGISTER_USER_RESPONSE_OK:
            return { ...state, requesting: false };
        case REGISTER_USER_RESPONSE_ERROR:
            return { ...state, requesting: false, errors: action.errors };
        default:
            return state;
    }
};
