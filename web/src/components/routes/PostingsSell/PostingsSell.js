import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';
import { setAdvertPreview, ADVERT_SELL } from 'components/routes/PostingsPreview/actions';

import PostingForm from './PostingForm';
import PostingTitle from './PostingTitle';

class PostingsSell extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(form) {
        const value = form.pricePerCoin.value;
        const extraData = form.pricePerCoin.type === 'PERCENTAGE_ADJUSTMENT'
            ? { percentageAdjustment: value, fixedPrice: null, author: this.props.userInfo.username, type: ADVERT_SELL }
            : { percentageAdjustment: null, fixedPrice: value, author: this.props.userInfo.username, type: ADVERT_SELL };

        this.props.setAdvertPreview(form, extraData);
        this.props.push('/postings/sell/preview');
    }

    render() {
        const { countries, states, userInfo } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/' text='Dashboard' />
                <PostingTitle />
                <PostingForm countries={countries} states={states} onSubmit={this.onSubmit} defaultCountry={userInfo ? userInfo.countryCode : undefined} />
            </Container>
        )
    }
}

const mapStateToProps = ({ app }) => ({
    countries: app.countries,
    states: app.states,
    userInfo: app.userInfo,
})

export default connect(mapStateToProps, { setAdvertPreview, push })(PostingsSell);
