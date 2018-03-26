import React from 'react';
import { connect } from 'react-redux';
import { initApp, getCountries, getStates } from './actions'

class AppInitializer extends React.Component {
    componentDidMount() {
        this.props.initApp();
        this.props.getCountries();
        this.props.getStates();
    }

    render() {
        return this.props.children;
    }
}


export default connect(null, { initApp, getCountries, getStates })(AppInitializer)
