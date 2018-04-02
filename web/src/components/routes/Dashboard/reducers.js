import { ADVERTS_DASHBOARD_RESPONSE } from './actions';
import { ADVERT_SELL, ADVERT_BUY } from 'components/routes/PostingsPreview/actions';

const initialState = {
    buyAdverts: [],
    sellAdverts: [],
    buyEnquiries: [],
    sellEnquiries: [],
    newMessages: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADVERTS_DASHBOARD_RESPONSE:
            const { myAdverts, enquiredAdverts } = action;

            const buyAdverts = myAdverts.filter(a => a.type === ADVERT_BUY);
            const sellAdverts = myAdverts.filter(a => a.type === ADVERT_SELL);
            const buyEnquiries = enquiredAdverts.filter(a => a.type === ADVERT_BUY);
            const sellEnquiries = enquiredAdverts.filter(a => a.type === ADVERT_SELL);

            return { ...state, buyAdverts, sellAdverts, buyEnquiries, sellEnquiries };
        default:
            return state;
    }
};
