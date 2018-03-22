import React from 'react';

import Container from '../../layout/Container';
import PostingForm from '../../layout/PostingForm';
import { BackIcLink } from '../../layout/Links';

import PostingTitle from './PostingTitle';

class PostingsBuy extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(form) {
    }

    render() {
        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/' text='Dashboard' />
                <PostingTitle />
                <PostingForm onSubmit={this.onSubmit} />
            </Container>
        )
    }
}

export default PostingsBuy
