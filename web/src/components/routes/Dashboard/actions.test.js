import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from 'api/'
import * as apiStubs from '__mocks__/api';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dashboard actions', () => {
    describe('getAdverts', () => {
        it('should dispatch ADVERTS_DASHBOARD_RESPONSE with received results', () => {
            const stubResponse = {
                myAdverts: [{ id: 1 }],
                enquiredAdverts: [{ id: 2 }],
            };
            api.getAdvertsForDashboard = apiStubs.getAdvertsForDashboardOk(stubResponse)
            const expectedActions = [{
                type: actions.ADVERTS_DASHBOARD_RESPONSE,
                myAdverts: [{ id: 1 }],
                enquiredAdverts: [{ id: 2 }],
            }];

            const store = mockStore({});
            store.dispatch(actions.getAdverts())
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });

    describe('extendExpirationDate', () => {
        it('should dispatch EXTEND_EXPIRATION_DATE and getAdverts', () => {
            const stubResponse = {
                myAdverts: [{ id: 1 }],
                enquiredAdverts: [{ id: 2 }],
            };
            const stubAdvertId = 1;

            api.getAdvertsForDashboard = apiStubs.getAdvertsForDashboardOk(stubResponse);
            api.extendExpirationDate = apiStubs.extendExpirationDateOk;

            const expectedActions = [{
                type: actions.EXTEND_EXPIRATION_DATE
            },{
                type: actions.ADVERTS_DASHBOARD_RESPONSE,
                myAdverts: [{ id: 1 }],
                enquiredAdverts: [{ id: 2 }],
            }];

            const store = mockStore({});
            const stub =
            store.dispatch(actions.extendExpirationDate(stubAdvertId))
                .then(() => expect(store.getActions()).toEqual(expectedActions));
        });
    });
});
