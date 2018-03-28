import { ACCEPT_TRADE_OPTIONS } from 'components/layout/PostingForm/constants';

export const SET_BUY_PREVIEW = 'SET_BUY_PREVIEW ';

export const ADVERT_SELL = 1;
export const ADVERT_BUY = 2;

export const setAdvertPreview = (formPreview, type, author) =>
    dispatch => {
        const preview = {
            additionalInfo: formPreview.additionalInfo,
            amountFrom: formPreview.cashAmount.from,
            amountTo: formPreview.cashAmount.to,
            author,
            city: formPreview.city,
            countryCode: formPreview.countryCode,
            currency: 'USD',
            fixedPrice: null,
            id: null,
            postalCode: formPreview.postalCode,
            percentageAdjustment: null,
            stateCode: formPreview.stateCode,
            tradeCashByMail: formPreview.acceptOptions.includes('tradeCashByMail'),
            tradeCashInPerson: formPreview.acceptOptions.includes('tradeCashInPerson'),
            tradeMoneyOrderByMail: formPreview.acceptOptions.includes('tradeMoneyOrderByMail'),
            tradeOther: formPreview.acceptOptions.includes('tradeOther'),
            travelDistance: formPreview.distance.data,
            travel: formPreview.distance.prefix,
            type
        };
        dispatch({ type: SET_BUY_PREVIEW, preview });
    };

export const createAdvert = () =>
    dispatch => {
    };
