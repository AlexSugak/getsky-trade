import React from 'react';
import Container from '../../layout/Container';
import RegistrationForm from './RegistrationForm';

class Registration extends React.Component {

    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <h2>Registration</h2>
                <RegistrationForm />
            </Container>
        );
    }
}

export default Registration;
