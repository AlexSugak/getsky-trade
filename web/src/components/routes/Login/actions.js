import { push } from 'react-router-redux'

import { login as loginRequest } from '../../../api';
import { putAuthTokens, deleteAuthTokens } from '../../../storage'
import { getUserInfo } from 'components/AppInitializer/actions'

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_RESPONSE_OK = 'LOGIN_USER_RESPONSE_OK';
export const LOGIN_USER_RESPONSE_ERROR = 'LOGIN_USER_RESPONSE_ERROR';

export const LOGOUT_USER = 'LOGOUT_USER';
export const logout = () => {
    deleteAuthTokens();
    return { type: LOGOUT_USER };
};

export const loginUserResponseOk = () => ({
    type: LOGIN_USER_RESPONSE_OK
});

export const login = (user, fromLocation = '/') =>
    async dispatch => {
        dispatch({ type: LOGIN_USER_REQUEST });
        try {
            const response = await loginRequest(user);
            dispatch(loginUserResponseOk());
            putAuthTokens(response.data);
            dispatch(getUserInfo());
            dispatch(push(fromLocation));
        }
        catch (e) {
            if (e.response.status === 401) {
                dispatch({ type: LOGIN_USER_RESPONSE_ERROR })
                return Promise.reject({ userName: ' ', password: e.response.data });
            }
        }
    };
