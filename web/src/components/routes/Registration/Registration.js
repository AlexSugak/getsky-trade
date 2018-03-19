import React from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import Container from '../../layout/Container';
import RegistrationForm from './RegistrationForm';
import { register } from './actions'

class Registration extends React.Component {
    onSubmit = (user) => {
        const { registerUser } = this.props;

        return registerUser(user)
            .catch(err => {
                throw new SubmissionError(err)
            });
    }

    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <h2>Registration</h2>
                <RegistrationForm onSubmit={this.onSubmit} />
            </Container>
        );
    }
}

export default connect(null, { registerUser: register })(Registration)
