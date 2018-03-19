import { LOGIN_USER_RESPONSE_OK, LOGIN_USER_RESPONSE_ERROR } from './actions'
import reduce, { initialState } from './reducers';

describe('login reducers', () => {
    describe('LOGIN_USER_RESPONSE_OK', () => {
        it('should set authorized true', () => {
            const state = reduce(initialState, { type: LOGIN_USER_RESPONSE_OK });
            expect(state).toEqual({ ...initialState, authorized: true });
        });
    });

    describe('LOGIN_USER_RESPONSE_ERROR', () => {
        it('should set authorized false', () => {
            const state = reduce(initialState, { type: LOGIN_USER_RESPONSE_ERROR });
            expect(state).toEqual({ ...initialState, authorized: false });
        });
    });
});
