import {
    getAdvertsForDashboard,
    extendExpirationDate as extendExpirationDateReq,
    deleteAdvert as deleteAdvertRequest
} from 'api/';

export const ADVERTS_DASHBOARD_RESPONSE = 'ADVERTS_DASHBOARD_RESPONSE';

const advertsResponseAction = (myAdverts, enquiredAdverts) => ({
    type: ADVERTS_DASHBOARD_RESPONSE,
    myAdverts,
    enquiredAdverts,
});

export const getAdverts = () =>
    async dispatch => {
        const res = await getAdvertsForDashboard();
        dispatch(advertsResponseAction(res.data.myAdverts, res.data.enquiredAdverts))
    };

export const EXTEND_EXPIRATION_DATE = 'EXTEND_EXPIRATION_DATE';

export const extendExpirationDate = advertId =>
    async dispatch => {
        await extendExpirationDateReq(advertId);
        dispatch({ type: EXTEND_EXPIRATION_DATE });
        dispatch(getAdverts());
    };

export const DELETE_ADVERT = 'DELETE_ADVERT';
export const deleteAdvert = advertId => async dispatch => {
    await deleteAdvertRequest(advertId);
    dispatch({ type: DELETE_ADVERT, advertId, });
    dispatch(getAdverts());
};
