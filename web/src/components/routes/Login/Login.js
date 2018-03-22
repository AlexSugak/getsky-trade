import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';

import LoginForm from './LoginForm';
import { login } from './actions';
import Container from '../../layout/Container';
import { U, H2, H3 } from '../../layout/Text';

class Login extends React.Component {
    onSubmit = (user) => {
        const { loginUser } = this.props;

        return loginUser(user)
            .catch(err => {
                throw new SubmissionError(err)
            });
    }

    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <H2>Login</H2>
                <H3>Don't have an account? <Link to="/register"><U>Register</U></Link></H3>
                <LoginForm onSubmit={this.onSubmit} />
            </Container>
        );
    }
}


export default connect(null, { loginUser: login })(Login)
