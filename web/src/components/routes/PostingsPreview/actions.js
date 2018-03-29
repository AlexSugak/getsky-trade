import { push } from 'react-router-redux';
import { postBuyAdvert, postSellAdvert } from 'api/';

export const SET_BUY_PREVIEW = 'SET_BUY_PREVIEW ';

export const ADVERT_SELL = 1;
export const ADVERT_BUY = 2;

export const setAdvertPreview = (formPreview, extraData) =>
    dispatch => {
        const preview = {
            additionalInfo: formPreview.additionalInfo,
            amountFrom: formPreview.cashAmount.from,
            amountTo: formPreview.cashAmount.to,
            city: formPreview.city,
            countryCode: formPreview.countryCode,
            currency: 'USD',
            fixedPrice: formPreview.fixedPrice,
            id: null,
            postalCode: formPreview.postalCode,
            percentageAdjustment: formPreview.percentageAdjustment,
            stateCode: formPreview.stateCode,
            tradeCashByMail: formPreview.acceptOptions.includes('tradeCashByMail'),
            tradeCashInPerson: formPreview.acceptOptions.includes('tradeCashInPerson'),
            tradeMoneyOrderByMail: formPreview.acceptOptions.includes('tradeMoneyOrderByMail'),
            tradeOther: formPreview.acceptOptions.includes('tradeOther'),
            travelDistance: formPreview.distance.data,
            travel: formPreview.distance.prefix,
            ...extraData
        };

        dispatch({ type: SET_BUY_PREVIEW, preview });
    };

export const createBuyAdvert = (advert) =>
    async dispatch => {
        await postBuyAdvert(advert);
        dispatch(push('/'));
    };

export const createSellAdvert = (advert) =>
    async dispatch => {
        await postSellAdvert(advert);
        dispatch(push('/'));
    };
