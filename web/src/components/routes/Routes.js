import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LatestAdverts from './LatestAdverts';
import SearchAdverts from './SearchAdverts';
import Registration from './Registration';
import Login from './Login';
import PostingsBuy from './PostingsBuy';
import PostingsPreview from './PostingsPreview';
import PostingsSell from './PostingsSell';
import AdvertDetails from './AdvertDetails';
import UserSettings from './UserSettings';
import Dashboard from './Dashboard';

const PrivateRoute = connect(({ login }) => ({
    login
}), null)(({ login, ...props }) => {
    if (login.authorized) return <Route {...props} />

    return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
});

const Routes = ({ match }) => {
    return (
        <Switch>
            <Route path={`/search`} component={SearchAdverts} />
            <Route path={`/register`} component={Registration} />
            <Route path={`/login`} component={Login} />
            <Route path={`/post/:id`} component={AdvertDetails} />

            <PrivateRoute path={`/dashboard`} component={Dashboard} />
            <PrivateRoute path={`/user-settings`} component={UserSettings} />
            <PrivateRoute path={`/postings/buy/preview`} component={PostingsPreview} />
            <PrivateRoute path={`/postings/buy`} component={PostingsBuy} />
            <PrivateRoute path={`/postings/sell/preview`} component={PostingsPreview} />
            <PrivateRoute path={`/postings/sell`} component={PostingsSell} />
            <Route path={`/`} component={LatestAdverts} />
        </Switch>
    );
};

Routes.propTypes = {
    match: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }).isRequired,
};

export default Routes;
