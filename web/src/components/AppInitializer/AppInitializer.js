import React from 'react';
import { connect } from 'react-redux';
import { initApp, getCountries, getStates, getUserInfo, requestSkycoinPrice } from './actions'

class AppInitializer extends React.Component {
    componentWillMount() {
        this.props.initApp();
        this.props.getCountries();
        this.props.getStates();
        this.props.getUserInfo();
        // TODO: Remove hardcoded value if the app support different currencies
        this.props.requestSkycoinPrice('USD');
    }

    render() {
        return this.props.children;
    }
}


export default connect(null, {
    initApp,
    getCountries,
    getStates,
    getUserInfo,
    requestSkycoinPrice,
})(AppInitializer)
