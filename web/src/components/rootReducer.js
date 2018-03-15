import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';
import registration from './routes/Registration/reducers'

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    latestAdverts,
    registration,
});


export default rootReducer;