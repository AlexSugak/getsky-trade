import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api'
import * as apiStubs from '../../../__mocks__/api';
import '../../../__mocks__/mock-localstorage';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('login actions', () => {
    describe('loginUserResponseOk', () => {
        it('should return LOGIN_USER_RESPONSE_OK action', () => {
            expect(actions.loginUserResponseOk()).toEqual({ type: actions.LOGIN_USER_RESPONSE_OK });
        });
    });

    describe('login', () => {
        const stubUser = { username: 'test', password: 'test' }

        it('should dispatch LOGIN_USER_RESPONSE_OK and navigate to / when response OK', () => {
            const expectedActions = [
                { type: actions.LOGIN_USER_REQUEST },
                { type: actions.LOGIN_USER_RESPONSE_OK },
                { type: '@@router/CALL_HISTORY_METHOD', payload: { args: ['/'], method: 'push' } }
            ];

            api.login = apiStubs.loginOk;
            const store = mockStore({})
            return store.dispatch(actions.login(stubUser))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });

        it('should dispatch LOGIN_USER_RESPONSE_ERROR and reject promise when response 401', () => {
            const expectedActions = [
                { type: actions.LOGIN_USER_REQUEST },
                { type: actions.LOGIN_USER_RESPONSE_ERROR }
            ];

            api.login = apiStubs.login401;
            const store = mockStore({})

            return store.dispatch(actions.login(stubUser))
                .catch(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
