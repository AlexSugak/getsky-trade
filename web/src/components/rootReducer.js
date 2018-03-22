import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';
import login from './routes/Login/reducers';
import postingsBuy from './routes/PostingsBuy/reducers';
import advertDetails from './routes/AdvertDetails/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    latestAdverts,
    login,
    postingsBuy,
    advertDetails,
});


export default rootReducer;
