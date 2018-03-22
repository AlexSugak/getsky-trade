import {
    getCountries as getCountriesRequest,
    getStates as getStatesRequest
} from '../../../api';

export const GET_COUNTRIES_RESPONSE = 'GET_COUNTRIES_RESPONSE';

export const getCountries = () =>
    async dispatch => {
        const countries = await getCountriesRequest();

        dispatch({
            type: GET_COUNTRIES_RESPONSE,
            countries: countries.data,
        });
    };

export const GET_STATES_RESPONSE = 'GET_STATES_RESPONSE';

export const getStates = () =>
    async dispatch => {
        const states = await getStatesRequest();

        dispatch({
            type: GET_STATES_RESPONSE,
            states: states.data,
        });
    };
