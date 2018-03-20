import React from 'react';

import Container from '../../layout/Container';
import PostingForm from '../../layout/PostingForm';
import { BackIcLink } from '../../layout/Links';

class PostingsBuy extends React.Component {
    render() {
        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/' text='Dashboard' />
                <PostingForm />
            </Container>
        )
    }
}

export default PostingsBuy
