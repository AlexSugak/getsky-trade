import { ADVERTS_DASHBOARD_RESPONSE } from './actions';
import { ADVERT_SELL, ADVERT_BUY } from 'components/routes/PostingsPreview/actions';

const initialState = {
    buyAdverts: [],
    sellAdverts: [],
    buyEnquiries: [],
    sellEnquiries: [],
    enquiriesToBuyers: 0,
    enquiriesToSellers: 0,
    newMessages: 0,
};

const simplifyAdvert = a => ({
    ...a.advert,
    newMessagesAmount: a.newMessagesAmount,
    totalMessagesAmount: a.totalMessagesAmount
});

export default (state = initialState, action) => {
    switch (action.type) {
        case ADVERTS_DASHBOARD_RESPONSE:
            const { myAdverts, enquiredAdverts } = action;

            const myAdvertsNewMessages = myAdverts.reduce((acc, cur) => cur.newMessagesAmount + acc, 0);
            const enquiredAdvertsNewMessages = enquiredAdverts.reduce((acc, cur) => cur.newMessagesAmount + acc, 0);
            const enquiriesToBuyers = enquiredAdverts.reduce((acc, cur) => cur.writtenBuyMessagesAmount + acc, 0);
            const enquiriesToSellers = enquiredAdverts.reduce((acc, cur) => cur.writtenSellMessagesAmount + acc, 0);

            const buyAdverts = myAdverts.filter(a => a.advert.type === ADVERT_BUY).map(simplifyAdvert);
            const sellAdverts = myAdverts.filter(a => a.advert.type === ADVERT_SELL).map(simplifyAdvert);

            const buyEnquiries = enquiredAdverts.filter(a => a.advert.type === ADVERT_BUY).map(simplifyAdvert);
            const sellEnquiries = enquiredAdverts.filter(a => a.advert.type === ADVERT_SELL).map(simplifyAdvert);

            return {
                ...state,
                buyAdverts,
                sellAdverts,
                buyEnquiries,
                sellEnquiries,
                enquiriesToBuyers,
                enquiriesToSellers,
                newMessages: myAdvertsNewMessages + enquiredAdvertsNewMessages,
            };
        default:
            return state;
    }
};
