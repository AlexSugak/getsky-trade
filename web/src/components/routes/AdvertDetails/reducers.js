import {
    GET_ADVERT_DETAILS_REQUEST,
    GET_ADVERT_DETAILS_RESPONSE,
} from './actions';

import {
    SKYCOIN_PRICE_REQUEST,
    SKYCOIN_PRICE_RESPONSE,
} from 'components/AppInitializer/actions'

export const initialState = {
    loading: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ADVERT_DETAILS_REQUEST:
            return initialState;
        case GET_ADVERT_DETAILS_RESPONSE:
            return { ...state, ...action.details, loading: false, };
        case SKYCOIN_PRICE_REQUEST:
            return { ...state, loading: true };
        case SKYCOIN_PRICE_RESPONSE:
            return { ...state, loading: false };
        default:
            return state;
    }
};
