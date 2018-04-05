import { push } from 'react-router-redux';
import { postBuyAdvert, postSellAdvert } from 'api/';
import { SellFormName, BuyFormName } from 'constants/index'

export const SET_FORM_PREVIEW = 'SET_FORM_PREVIEW ';

export const ADVERT_SELL = 1;
export const ADVERT_BUY = 2;

const destroyForm = formName => ({
    type: '@@redux-form/DESTROY',
    meta: {
        form: [
            formName,
        ]
    }
});

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

        dispatch({ type: SET_FORM_PREVIEW, preview });
    };

export const createBuyAdvert = (advert) =>
    async dispatch => {
        await postBuyAdvert(advert);
        dispatch(push('/'));
        dispatch(destroyForm(BuyFormName));
    };

export const createSellAdvert = (advert) =>
    async dispatch => {
        await postSellAdvert(advert);
        dispatch(push('/'));
        dispatch(destroyForm(SellFormName));
    };
