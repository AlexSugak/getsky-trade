import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import latestAdverts from './routes/LatestAdverts/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    latestAdverts,
});


export default rootReducer;