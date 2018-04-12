import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Container from 'components/layout/Container';
import { H2 } from 'components/layout/Text';

import ContactUsForm from './ContactUsForm';
import { submitFeedbackForm } from './actions';

class ContactUs extends React.Component {
    handleSubmit = form => {
        const { submitFeedbackForm, push } = this.props;

        return submitFeedbackForm(form)
            .then(() => {
                push('/');
            });
    }
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <H2>Contact us</H2>
                <ContactUsForm onSubmit={this.handleSubmit} />
            </Container>);
    }
}

export default connect(null, { submitFeedbackForm, push })(ContactUs);
