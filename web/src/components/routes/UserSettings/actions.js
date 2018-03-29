import { updateUserSettings } from 'api'

export const SAVE_USER_SETTINGS_REQUEST = 'SAVE_USER_SETTINGS_REQUEST';
export const SAVE_USER_SETTINGS_RESPONSE = 'SAVE_USER_SETTINGS_RESPONSE';

export const saveUserSettings = settings => async dispatch => {
    dispatch({ type: SAVE_USER_SETTINGS_REQUEST, });

    await updateUserSettings(settings);

    dispatch({ type: SAVE_USER_SETTINGS_RESPONSE, });
};

export const loadForm = data => ({
    type: 'LOAD',
    data,
});
