import React from 'react';
import { connect } from 'react-redux';
import { initApp } from './actions'

class AppInitializer extends React.Component {
    componentDidMount() {
        this.props.init();
    }

    render() {
        return this.props.children;
    }
}


export default connect(null, { init: initApp })(AppInitializer)
