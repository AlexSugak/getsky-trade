import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';

import PostingForm from './PostingForm';
import PostingTitle from './PostingTitle';

class PostingsBuy extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(form) {
    }

    render() {
        const { countries, states } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/' text='Dashboard' />
                <PostingTitle />
                <PostingForm countries={countries} states={states} onSubmit={this.onSubmit} />
            </Container>
        )
    }
}

const mapStateToProps = ({ app }) => ({
    countries: app.countries,
    states: app.states,
})

export default connect(mapStateToProps)(PostingsBuy);
