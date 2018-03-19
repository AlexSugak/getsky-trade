import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    latestAdverts,
});


export default rootReducer;
