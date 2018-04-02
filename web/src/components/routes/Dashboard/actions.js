import { getAdvertsForDashboard } from 'api/';

export const ADVERTS_DASHBOARD_RESPONSE = 'ADVERTS_DASHBOARD_RESPONSE';

const advertsResponseAction = (myAdverts, enquiredAdverts) => ({
    type: ADVERTS_DASHBOARD_RESPONSE,
    myAdverts,
    enquiredAdverts
});

export const getAdverts = () =>
    async dispatch => {
        const res = await getAdvertsForDashboard();
        dispatch(advertsResponseAction(res.data.myAdverts, res.data.enquiredAdverts))
    };
