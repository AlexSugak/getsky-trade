import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../api'
import * as apiStubs from '../../../__mocks__/api';
import '../../../__mocks__/mock-localstorage';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('register actions', () => {
    describe('register', () => {
        const stubRegisterForm = { }

        it('should dispatch REGISTER_USER_RESPONSE_OK and navigate to login when response OK', () => {
            const expectedActions = [
                { type: actions.REGISTER_USER_REQUEST },
                { type: actions.REGISTER_USER_RESPONSE_OK },
                { type: '@@router/CALL_HISTORY_METHOD', payload: { args: ['/login'], method: 'push' } }
            ];

            api.registerUser = apiStubs.registerUserOk;
            const store = mockStore({})
            return store.dispatch(actions.register(stubRegisterForm))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });

        it('should dispatch REGISTER_USER_RESPONSE_ERROR when response OK', () => {
            const expectedActions = [
                { type: actions.REGISTER_USER_REQUEST },
                { type: actions.REGISTER_USER_RESPONSE_ERROR },
            ];

            api.registerUser = apiStubs.registerUser400;
            const store = mockStore({})
            return store.dispatch(actions.register(stubRegisterForm))
                .catch(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
