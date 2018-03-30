import React from 'react';
import { connect } from 'react-redux';
import { initApp, getCountries, getStates, getUserInfo, requestSkycoinPrice } from './actions'

class AppInitializer extends React.Component {
    componentWillMount() {
        this.props.initApp();
        this.props.getCountries();
        this.props.getStates();
        this.props.getUserInfo();
        this.props.app.currencies.forEach(c => this.props.requestSkycoinPrice(c));
    }

    render() {
        return this.props.children;
    }
}


export default connect(({ app }) => ({ app }), {
    initApp,
    getCountries,
    getStates,
    getUserInfo,
    requestSkycoinPrice,
})(AppInitializer)
