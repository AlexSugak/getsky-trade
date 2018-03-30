import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from 'api/'
import * as apiStubs from '__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('postingsPreview actions', () => {
    describe('setAdvertPreview', () => {
        it('should dispatch SET_FORM_PREVIEW action', () => {
            const formStub = {
                additionalInfo: 'stubAdditionalInfo',
                cashAmount: { from: 1, to: 2 },
                city: 'stubCity',
                countryCode: 'stubCountryCode',
                fixedPrice: 1,
                postalCode: 'stubPostalCode',
                percentageAdjustment: 1,
                stateCode: 'stateCode',
                acceptOptions: ['tradeCashByMail'],
                distance: { data: 1, prefix: 'mi' },
            };
            const extraDataStub = { extraData: 'extraData' };

            const expectedActions = [{
                type: actions.SET_FORM_PREVIEW, preview: {
                    additionalInfo: 'stubAdditionalInfo',
                    amountFrom: 1,
                    amountTo: 2,
                    city: 'stubCity',
                    countryCode: 'stubCountryCode',
                    currency: 'USD',
                    fixedPrice: 1,
                    id: null,
                    postalCode: 'stubPostalCode',
                    percentageAdjustment: 1,
                    stateCode: 'stateCode',
                    tradeCashByMail: true,
                    tradeCashInPerson: false,
                    tradeMoneyOrderByMail: false,
                    tradeOther: false,
                    travelDistance: 1,
                    travel: 'mi',
                    currency: 'USD',
                    id: null,
                    ...extraDataStub,
                }
            }];

            const store = mockStore({});
            store.dispatch(actions.setAdvertPreview(formStub, extraDataStub));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('createBuyAdvert', () => {
        it('should call postBuyAdvert api and dispatch a redux-router push action', () => {
            const expectedActions = [
                { type: '@@router/CALL_HISTORY_METHOD', payload: { args: ['/'], method: 'push' } },
                { type: '@@redux-form/DESTROY', meta: { form: ['formPostingToBuy'] } },
            ];
            const formStub = { id: 1 };
            api.postBuyAdvert = apiStubs.createBuyAdvertOk;

            const store = mockStore({});
            return store.dispatch(actions.createBuyAdvert(formStub))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        })
    });

    describe('createSellAdvert', () => {
        it('should call postSellAdvert api and dispatch a redux-router push action', () => {
            const expectedActions = [
                { type: '@@router/CALL_HISTORY_METHOD', payload: { args: ['/'], method: 'push' } },
                { type: '@@redux-form/DESTROY', meta: { form: ['formPostingToSell'] } },
            ];
            const formStub = { id: 1 };
            api.postSellAdvert = apiStubs.createSellAdvertOk;

            const store = mockStore({});
            return store.dispatch(actions.createSellAdvert(formStub))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        })
    });
});
