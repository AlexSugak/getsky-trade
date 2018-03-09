import { registerUser } from '../../../api';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_RESPONSE = 'GET_ADVERTS_RESPONSE';

export const register =  (user) => async dispatch => {
    dispatch({ type: REGISTER_USER_REQUEST });

    const response = await registerUser(user);
    console.log(response);

    dispatch({ type: REGISTER_USER_RESPONSE });
};