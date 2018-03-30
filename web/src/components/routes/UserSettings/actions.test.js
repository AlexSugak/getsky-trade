import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './actions';
import * as api from 'api';
import * as apiStubs from '__mocks__/api';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('userSettingsActions', () => {
    describe('saveUserSettings', () => {
        it('should dispatch SAVE_USER_SETTINGS_REQUEST and SAVE_USER_SETTINGS_RESPONSE actions and call saveUserSettingApi', () => {
            const userSettingsStub = {};
            const expectedActions = [
                { type: actions.SAVE_USER_SETTINGS_REQUEST },
                { type: actions.SAVE_USER_SETTINGS_RESPONSE },
            ];

            api.updateUserSettings = apiStubs.updateUserSettingsOk;
            const store = mockStore({});
            return store.dispatch(actions.saveUserSettings(userSettingsStub))
                .then(() => expect(store.getActions()).toEqual(expectedActions))
        });
    });

    describe('changePassword', () => {
        it('should dispatch CHANGE_PASSWORD_REQUEST and CHANGE_PASSWORD_RESPONSE actions and call changePasswordApi', () => {
            const passwordFormStub = {};
            const expectedActions = [
                { type: actions.CHANGE_PASSWORD_REQUEST },
                { type: actions.CHANGE_PASSWORD_RESPONSE },
            ];

            api.changePassword = apiStubs.changePasswordOk;
            const store = mockStore({});
            return store.dispatch(actions.changePassword(passwordFormStub))
                .then(() => expect(store.getActions()).toEqual(expectedActions))
        });
    });
});
