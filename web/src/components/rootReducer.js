import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';
import login from './routes/Login/reducers';
import advertDetails from './routes/AdvertDetails/reducers';
import dashboard from './routes/Dashboard/reducers';
import preview from './routes/PostingsPreview/reducers';
import app from './AppInitializer/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    app,
    latestAdverts,
    login,
    advertDetails,
    preview,
    dashboard,
});


export default rootReducer;
