import { updateAdvert } from 'api/index';

export const SAVE_ADVERT = 'SAVE_ADVERT';
export const saveAdvert = advert => async dispatch => {
    await updateAdvert(advert.id, advert);
    dispatch({ type: SAVE_ADVERT });
};
