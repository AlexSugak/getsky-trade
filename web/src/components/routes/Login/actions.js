import { push } from 'react-router-redux'

import { login as loginRequest } from '../../../api';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_RESPONSE_OK = 'LOGIN_USER_RESPONSE_OK';
export const LOGIN_USER_RESPONSE_ERROR = 'LOGIN_USER_RESPONSE_ERROR';

export const login = (user) =>
    async dispatch => {
        dispatch({ type: LOGIN_USER_REQUEST });

        try {
            const response = await loginRequest(user);
            dispatch({ type: LOGIN_USER_RESPONSE_OK, data: response.data });
            dispatch(push('/'));
        }
        catch (e) {
            if (e.response.status === 400) {
                const errors = e.response.data;
                dispatch({ type: LOGIN_USER_RESPONSE_ERROR, errors: e.response.data });
                const formErrors = {};
                Object.values(errors).map(k => formErrors[k.key] = k.message)
                throw formErrors;
            }
        }
    };
