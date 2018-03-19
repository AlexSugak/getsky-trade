import { push } from 'react-router-redux'

import { login as loginRequest } from '../../../api';
import { putAuthTokens } from '../../../storage'

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_RESPONSE_OK = 'LOGIN_USER_RESPONSE_OK';
export const LOGIN_USER_RESPONSE_ERROR = 'LOGIN_USER_RESPONSE_ERROR';

export const LOGOUT_USER = 'LOGOUT_USER';

export const loginUserResponseOk = () => ({
    type: LOGIN_USER_RESPONSE_OK
});

export const login = (user) =>
    async dispatch => {
        dispatch({ type: LOGIN_USER_REQUEST });
        try {
            const response = await loginRequest(user);
            dispatch(loginUserResponseOk());
            putAuthTokens(response.data);
            dispatch(push('/'));
        }
        catch (e) {
            if (e.response.status === 401) {
                dispatch({ type: LOGIN_USER_RESPONSE_ERROR })
                return Promise.reject({ userName: ' ', password: e.response.data });
            }
        }
    };
