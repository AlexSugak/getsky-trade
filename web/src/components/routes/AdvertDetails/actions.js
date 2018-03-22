import { getAdvertDetails } from '../../../api';

export const GET_ADVERT_DETAILS_REQUEST = 'GET_ADVERT_DETAILS_REQUEST';
export const GET_ADVERT_DETAILS_RESPONSE = 'GET_ADVERT_DETAILS_RESPONSE';

export const requestAdvertDetails = id => async dispatch => {
    dispatch({ type: GET_ADVERT_DETAILS_REQUEST });

    const response = await getAdvertDetails(id);

    dispatch({ type: GET_ADVERT_DETAILS_RESPONSE, details: response.data });
};
