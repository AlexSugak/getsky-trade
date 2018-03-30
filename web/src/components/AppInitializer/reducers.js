import {
    GET_COUNTRIES_RESPONSE,
    GET_STATES_RESPONSE,
    GET_USER_INFO_RESPONSE,
    SKYCOIN_PRICE_RESPONSE,
} from './actions';

export const initialState = {
    countries: [],
    states: [],
    userInfo: null,
    skyPrices: {},
    currencies: ['USD', 'EUR'],
};

const saveSkycoinPrice = (prices, currency, price) => {
    const mutation = {};
    mutation[currency] = price;

    return { ...prices, ...mutation };
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_COUNTRIES_RESPONSE:
            return { ...state, countries: action.countries.map(c => ({ text: c.name, value: c.code })) };
        case GET_STATES_RESPONSE:
            return { ...state, states: action.states.map(s => ({ text: s.name, value: s.code })) };
        case GET_USER_INFO_RESPONSE:
            return { ...state, userInfo: action.userInfo };
        case SKYCOIN_PRICE_RESPONSE:
            return { ...state, skyPrices: saveSkycoinPrice(state.skyPrices, action.currency, action.price) };
        default:
            return state;
    }
};
