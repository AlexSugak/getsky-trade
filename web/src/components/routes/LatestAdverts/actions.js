import { getAllAdverts } from '../../../api';

export const GET_ADVERTS_REQUEST = 'GET_ADVERTS_REQUEST';
export const GET_ADVERTS_RESPONSE = 'GET_ADVERTS_RESPONSE';

export const getAdverts = () => async (dispatch) => {
    dispatch({ type: GET_ADVERTS_REQUEST });

    const allAdverts = await getAllAdverts();

    dispatch({ type: GET_ADVERTS_RESPONSE, allAdverts });
};