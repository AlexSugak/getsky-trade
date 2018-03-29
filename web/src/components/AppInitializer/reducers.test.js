import * as actions from './actions';
import reduce, { initialState } from './reducers';

describe('app initializer reducer', () => {
    describe('SKYCOIN_PRICE_RESPONSE', () => {
        it('should save received price to the reducer\'s state', () => {
            const priceStub = 123;
            const expectedState = { ...initialState, skyPrice: priceStub };
            expect(reduce(initialState, { type: actions.SKYCOIN_PRICE_RESPONSE, price: priceStub }))
                .toEqual(expectedState);
        });
    });
});
