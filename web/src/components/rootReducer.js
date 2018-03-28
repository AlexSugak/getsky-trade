import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';
import login from './routes/Login/reducers';
import advertDetails from './routes/AdvertDetails/reducers';
import buyPreview from './routes/PostingsBuyPreview/reducers';
import app from './AppInitializer/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    app,
    latestAdverts,
    login,
    advertDetails,
    buyPreview,
});


export default rootReducer;
