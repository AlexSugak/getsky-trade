import {
    GET_ADVERT_DETAILS_REQUEST,
    GET_ADVERT_DETAILS_RESPONSE,
} from './actions';

export const initialState = {
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ADVERT_DETAILS_REQUEST:
            return initialState;
        case GET_ADVERT_DETAILS_RESPONSE:
            return { ...state, ...action.details };
        default:
            return state;
    }
};
