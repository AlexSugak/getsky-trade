import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api';
import * as apiStubs from '../../../__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('advert details actions', () => {
    describe('getAdvertDetails', () => {
        it('should dispatch GET_ADVERT_DETAILS_RESPONSE action with advert details', () => {
            const stubDetails = { id: 1, type: 1, author: "bob", tradeCashInPerson: true, };
            const expectedActions = [
                { type: actions.GET_ADVERT_DETAILS_REQUEST },
                { type: actions.GET_ADVERT_DETAILS_RESPONSE, details: stubDetails }
            ];

            api.getAdvertDetails = apiStubs.getAdvertDetailsOk(stubDetails);
            const store = mockStore({});
            return store.dispatch(actions.requestAdvertDetails(stubDetails.id))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('requestSkycoinPrice', () => {
        it('should dispatch SKYCOIN_PRICE_RESPONSE action with received price', () => {
            const price = 1;
            const currency = 'EUR';
            const expectedActions = [
                { type: actions.SKYCOIN_PRICE_REQUEST },
                { type: actions.SKYCOIN_PRICE_RESPONSE, price }
            ];

            api.getSkycoinPrice = apiStubs.getSkycoinPriceOk(price);
            const store = mockStore({});
            return store.dispatch(actions.requestSkycoinPrice(currency))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
