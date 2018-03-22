import React from 'react';
import { connect } from 'react-redux';

import {
    requestAdvertDetails,
} from './actions';

export default connect(
    ({
        advertDetails,
    }) => ({
        ...advertDetails,
    }),
    {
        requestAdvertDetails,
    }
)(class extends React.Component {
    componentWillMount() {
        const { id, match, requestAdvertDetails } = this.props;
        if (id !== match.params.id) {
            requestAdvertDetails(match.params.id);
        }
    }
    render() {
        return (
            <div>
                {this.props.match.params.id}
            </div>);
    }
});
