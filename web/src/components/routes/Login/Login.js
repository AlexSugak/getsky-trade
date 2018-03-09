import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../layout/Container';
import LoginForm from './LoginForm';

class Login extends React.Component {
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <h2>Login</h2>
                <h3>Don't have an account? <Link to="/register">Register</Link></h3>
                <LoginForm />
            </Container>
        );
    }
}

export default Login;