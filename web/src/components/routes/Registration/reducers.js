import { REGISTER_USER_REQUEST, REGISTER_USER_RESPONSE } from './actions';

export const initialState = {
    buyAdverts: [],
    sellAdverts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            console.log('ololo');
            return initialState;
        case REGISTER_USER_RESPONSE:
            return initialState;
        default:
            return state;
    }
};