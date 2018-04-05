import { ADVERTS_DASHBOARD_RESPONSE } from './actions'
import reduce, { initialState } from './reducers';

describe('dashboard reducers', () => {
    describe('ADVERTS_DASHBOARD_RESPONSE', () => {
        it('should split adverts and calculate amount of new messages', () => {
            const action = {
                type: ADVERTS_DASHBOARD_RESPONSE,
                myAdverts: [{
                    advert: {
                        id: 6,
                        type: 1,
                    },
                    newMessagesAmount: 1,
                    totalMessagesAmount: 1
                }, {
                    advert: {
                        id: 5,
                        type: 2,
                    },
                    newMessagesAmount: 0,
                    totalMessagesAmount: 1
                }],
                enquiredAdverts: [{
                    advert: {
                        id: 8,
                        type: 1,
                    },
                    newMessagesAmount: 0,
                    totalMessagesAmount: 0,
                    writtenSellMessagesAmount: 3,
                    writtenBuyMessagesAmount: 0
                },
                {
                    advert: {
                        id: 9,
                        type: 2,
                    },
                    newMessagesAmount: 0,
                    totalMessagesAmount: 0,
                    writtenSellMessagesAmount: 0,
                    writtenBuyMessagesAmount: 4
                }],
            };

            const expectedState = {
                buyAdverts: [{ id: 5, type: 2, newMessagesAmount: 0, totalMessagesAmount: 1 }],
                buyEnquiries: [{ id: 9, newMessagesAmount: 0, totalMessagesAmount: 0, type: 2 }],
                sellAdverts: [{ id: 6, newMessagesAmount: 1, totalMessagesAmount: 1, type: 1 }],
                sellEnquiries: [{ id: 8, newMessagesAmount: 0, totalMessagesAmount: 0, type: 1 }],
                enquiriesToBuyers: 4,
                enquiriesToSellers: 3,
                newMessages: 1,
            };

            const state = reduce(initialState, action);

            expect(state).toEqual(expectedState);
        });
    });
});
