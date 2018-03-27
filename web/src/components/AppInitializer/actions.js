import { getAuthTokens } from '../../storage'
import { loginUserResponseOk } from '../routes/Login/actions';
import {
    getCountries as getCountriesRequest,
    getStates as getStatesRequest,
    getUserInfo as getUserInfoApi,
} from '../../api';

export const initApp = () =>
    async dispatch => {
        const authTokens = getAuthTokens();

        if (authTokens !== null) {
            dispatch(loginUserResponseOk());
        }
    }

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

export const GET_USER_INFO_RESPONSE = 'GET_USER_INFO_RESPONSE';
export const getUserInfo = () => async dispatch => {
    const response = await getUserInfoApi();
    dispatch({ type: GET_USER_INFO_RESPONSE, userInfo: response.data });
}
