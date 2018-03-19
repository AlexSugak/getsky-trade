import { getAuthTokens } from '../../storage'
import { loginUserResponseOk } from '../routes/Login/actions';

export const initApp = () =>
    async dispatch => {
        const authTokens = getAuthTokens();
        
        if (authTokens !== null) {
            dispatch(loginUserResponseOk());
        }
    }
