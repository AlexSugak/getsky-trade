import * as actions from './actions';
import reduce, { initialState } from './reducers';

describe('app initializer reducer', () => {
    describe('GET_COUNTRIES_RESPONSE', () => {
        it('should save and map received countries', () => {
            const countriesStub = [{
                name: 'StubCountry1',
                code: 'Value1'
            }, {
                name: 'StubCountry2',
                code: 'Value2'
            }];

            const expectedCountries = [{
                text: 'StubCountry1',
                value: 'Value1'
            }, {
                text: 'StubCountry2',
                value: 'Value2'
            }];

            const expectedState = { ...initialState, countries: expectedCountries };
            expect(reduce(initialState, { type: actions.GET_COUNTRIES_RESPONSE, countries: countriesStub }))
                .toEqual(expectedState);
        });
    });

    describe('GET_STATES_RESPONSE', () => {
        it('should save and map received states', () => {
            const statesStub = [{
                name: 'StubCountry1',
                code: 'Value1'
            }, {
                name: 'StubCountry2',
                code: 'Value2'
            }];

            const expectedStates = [{
                text: 'StubCountry1',
                value: 'Value1'
            }, {
                text: 'StubCountry2',
                value: 'Value2'
            }];

            const expectedState = { ...initialState, states: expectedStates };
            expect(reduce(initialState, { type: actions.GET_STATES_RESPONSE, states: statesStub }))
                .toEqual(expectedState);
        });
    });

    describe('GET_USER_INFO_RESPONSE', () => {
        it('should save userInfo', () => {
            const userInfo = { id: 1, userName: 'stubUserName' };

            const expectedState = { ...initialState, userInfo };
            expect(reduce(initialState, { type: actions.GET_USER_INFO_RESPONSE, userInfo }))
                .toEqual(expectedState);
        });
    });

    describe('SKYCOIN_PRICE_RESPONSE', () => {
        it('should save received price to the reducer\'s state', () => {
            const priceStub = 123;
            const currencyStub = 'EUR';
            const expectedState = { ...initialState, skyPrices: { EUR: priceStub } };
            expect(reduce(initialState, { type: actions.SKYCOIN_PRICE_RESPONSE, currency: currencyStub, price: priceStub }))
                .toEqual(expectedState);
        });
    });
});
