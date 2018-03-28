import React from 'react';
import { connect } from 'react-redux';
import { initApp, getCountries, getStates, getUserInfo } from './actions'

class AppInitializer extends React.Component {
    componentWillMount() {
        this.props.initApp();
        this.props.getCountries();
        this.props.getStates();
        this.props.getUserInfo();
    }

    render() {
        return this.props.children;
    }
}


export default connect(null, { initApp, getCountries, getStates, getUserInfo })(AppInitializer)
