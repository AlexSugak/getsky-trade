import { GET_COUNTRIES_RESPONSE, GET_STATES_RESPONSE } from './actions';

const initialState = {
    countries: [],
    states: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_COUNTRIES_RESPONSE:
            return { ...state, countries: action.countries.map(c => ({ text: c.name, value: c.code })) };
        case GET_STATES_RESPONSE:
            return { ...state, states: action.states.map(s => ({ text: s.name, value: s.code })) };
        default:
            return state;
    }
};
