import { getAdvertDetails, getSkycoinPrice } from '../../../api';

export const GET_ADVERT_DETAILS_REQUEST = 'GET_ADVERT_DETAILS_REQUEST';
export const GET_ADVERT_DETAILS_RESPONSE = 'GET_ADVERT_DETAILS_RESPONSE';

export const requestAdvertDetails = id => async dispatch => {
    dispatch({ type: GET_ADVERT_DETAILS_REQUEST });

    const response = await getAdvertDetails(id);

    dispatch({ type: GET_ADVERT_DETAILS_RESPONSE, details: response.data });

    return response.data;
};

export const SKYCOIN_PRICE_REQUEST = 'SKYCOIN_PRICE_REQUEST';
export const SKYCOIN_PRICE_RESPONSE = 'SKYCOIN_PRICE_RESPONSE';

export const requestSkycoinPrice = currency => async dispatch => {
    dispatch({ type: SKYCOIN_PRICE_REQUEST });
    const currencyFieldName = `price_${currency.toLowerCase()}`;

    const response = await getSkycoinPrice(currency);

    dispatch({ type: SKYCOIN_PRICE_RESPONSE, price: response.data[0][currencyFieldName] });
};
