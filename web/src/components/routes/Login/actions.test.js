import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api'
import * as apiStubs from '../../../__mocks__/api';
import '../../../__mocks__/mock-localstorage';

import * as actions from './actions';
import { GET_USER_INFO_RESPONSE } from 'components/AppInitializer/actions';

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
        const fromLocation = '/user-settings'

        it('should dispatch LOGIN_USER_RESPONSE_OK and navigate to / when response OK', () => {
            const expectedActions = [
                { type: actions.LOGIN_USER_REQUEST },
                { type: actions.LOGIN_USER_RESPONSE_OK },
                { type: '@@router/CALL_HISTORY_METHOD', payload: { args: [fromLocation], method: 'push' } },
                { type: GET_USER_INFO_RESPONSE, userInfo: {} },
            ];

            api.login = apiStubs.loginOk;
            api.getUserInfo = apiStubs.getUserInfoApiOk;
            const store = mockStore({})
            return store.dispatch(actions.login(stubUser, fromLocation))
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

    describe('logout', () => {
        it('should dispatch LOGOUT_USER action and delete auth tokens from localStorage', () => {
            expect(actions.logout()).toEqual({ type: actions.LOGOUT_USER });
        });
    });
});
