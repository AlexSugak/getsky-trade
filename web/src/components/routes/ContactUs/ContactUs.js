import React from 'react';

import Container from 'components/layout/Container';
import { U, H2, H3 } from 'components/layout/Text';

class ContactUs extends React.Component {
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" py={4}>
                <H2>Contact us</H2>
            </Container>);
    }
}

export default ContactUs;
