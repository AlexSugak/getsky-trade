import { Decimal } from "decimal.js-light";
import { getAdvertDetails, getSkycoinPrice } from "api/index";

export const GET_ADVERT_DETAILS_REQUEST = "GET_ADVERT_DETAILS_REQUEST";
export const GET_ADVERT_DETAILS_RESPONSE = "GET_ADVERT_DETAILS_RESPONSE";

export const requestAdvertDetails = id => async dispatch => {
    dispatch({ type: GET_ADVERT_DETAILS_REQUEST });
    try {
        const response = await getAdvertDetails(id);
        const details = response.data;
        dispatch({
            type: GET_ADVERT_DETAILS_RESPONSE,
            details: {
                ...details,
                amountFrom: details.amountFrom ? new Decimal(details.amountFrom) : null,
                amountTo: details.amountTo ? new Decimal(details.amountTo) : null,
            }
        });
        return response.data;
    } catch (e) {
        console.log(e)
        if (e.response.status === 404) {
            dispatch({
                type: GET_ADVERT_DETAILS_RESPONSE,
                details: { notFound: true }
            });
            return null;
        }
    }
};

export const SKYCOIN_PRICE_REQUEST = "SKYCOIN_PRICE_REQUEST";
export const SKYCOIN_PRICE_RESPONSE = "SKYCOIN_PRICE_RESPONSE";

export const requestSkycoinPrice = currency => async dispatch => {
    dispatch({ type: SKYCOIN_PRICE_REQUEST });
    const currencyFieldName = `price_${currency.toLowerCase()}`;

    const response = await getSkycoinPrice(currency);
    dispatch({
        type: SKYCOIN_PRICE_RESPONSE,
        price: response.data[0][currencyFieldName]
    });
};
