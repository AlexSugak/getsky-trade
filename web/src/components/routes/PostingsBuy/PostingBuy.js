import React from 'react';
import { connect } from 'react-redux';

import Container from '../../layout/Container';
import PostingForm from '../../layout/PostingForm';
import { BackIcLink } from '../../layout/Links';

import PostingTitle from './PostingTitle';
import { getCountries, getStates } from './actions';

class PostingsBuy extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const { getCountriesReq, getStatesReq } = this.props;

        getStatesReq();
        getCountriesReq();
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

const mapStateToProps = ({ postingsBuy }) => ({
    countries: postingsBuy.countries,
    states: postingsBuy.states,
})

const mapDispatchToProps = {
    getCountriesReq: getCountries,
    getStatesReq: getStates,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostingsBuy);
