import { updateUserSettings, changePassword as changePasswordApi } from 'api'

export const SAVE_USER_SETTINGS_REQUEST = 'SAVE_USER_SETTINGS_REQUEST';
export const SAVE_USER_SETTINGS_RESPONSE = 'SAVE_USER_SETTINGS_RESPONSE';

export const saveUserSettings = settings => async dispatch => {
    dispatch({ type: SAVE_USER_SETTINGS_REQUEST, });
    try {
        await updateUserSettings(settings);
    } catch (e) {
        if (e.response.status === 400) {
            const errors = e.response.data;

            const formErrors = {};
            Object.values(errors).map(k => formErrors[k.key] = k.message)
            return Promise.reject(formErrors);
        }
    }

    dispatch({ type: SAVE_USER_SETTINGS_RESPONSE, });
};

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_RESPONSE = 'CHANGE_PASSWORD_RESPONSE';
export const changePassword = passwords => async dispatch => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST, });

    try {
        await changePasswordApi(passwords);
    } catch (e) {
        if (e.response.status === 400) {
            const errors = e.response.data;

            const formErrors = {};
            Object.values(errors).map(k => formErrors[k.key] = k.message)
            return Promise.reject(formErrors);
        }
    }

    dispatch({ type: CHANGE_PASSWORD_RESPONSE, });
}
