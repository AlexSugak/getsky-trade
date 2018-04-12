import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';

import { requestAdvertDetails } from '../AdvertDetails/actions';
import { saveAdvert } from './actions';

import { ADVERT_BUY, ADVERT_SELL } from 'components/routes/PostingsPreview/actions';

import PostingBuyForm from '../PostingsBuy/PostingForm';
import PostingSellForm from '../PostingsSell/PostingForm';

const mapAcceptOptions = a => {
    return ['tradeCashByMail', 'tradeCashInPerson', 'tradeMoneyOrderByMail', 'tradeOther']
        .filter(o => a[o]);
};

const mapAdvertDetailsToForm = a => (
    {
        ...a,
        cashAmount: {
            from: a.amountFrom && a.amountFrom.toString(),
            to: a.amountTo && a.amountTo.toString(),
            mode: a.amountTo ? 'RANGED_MODE' : 'SINGLE_MODE'
        },
        acceptOptions: mapAcceptOptions(a),
        distance: { data: a.travelDistance, prefix: a.travelDistanceUoM },
        pricePerCoin: {
            type: a.percentageAdjustment ? 'PERCENTAGE_ADJUSTMENT' : '',
            value: a.percentageAdjustment || a.fixedPrice,
        }
    }
);

class PostingsBuy extends React.Component {
    componentWillMount() {
        this.props.requestAdvertDetails(this.props.match.params.id);
    }
    onSubmit = async form => {
        const { advertDetails, saveAdvert, push } = this.props;
        let extraData = {};
        if (advertDetails.type === ADVERT_BUY) {
            extraData = {};
        }
        if (advertDetails.type === ADVERT_SELL) {
            const { value } = form.pricePerCoin;
            extraData = form.pricePerCoin.type === 'PERCENTAGE_ADJUSTMENT'
                ? { percentageAdjustment: value, fixedPrice: null, }
                : { percentageAdjustment: null, fixedPrice: value, };
        }

        const advert = {
            additionalInfo: form.additionalInfo,
            amountFrom: form.cashAmount.from,
            amountTo: form.cashAmount.to === '' ? undefined : form.cashAmount.to,
            city: form.city,
            countryCode: form.countryCode,
            currency: 'USD',
            fixedPrice: form.fixedPrice,
            id: advertDetails.id,
            postalCode: form.postalCode,
            percentageAdjustment: form.percentageAdjustment,
            stateCode: form.stateCode,
            tradeCashByMail: form.acceptOptions.includes('tradeCashByMail'),
            tradeCashInPerson: form.acceptOptions.includes('tradeCashInPerson'),
            tradeMoneyOrderByMail: form.acceptOptions.includes('tradeMoneyOrderByMail'),
            tradeOther: form.acceptOptions.includes('tradeOther'),
            travelDistance: form.distance.data,
            travelDistanceUoM: form.distance.prefix,
            ...extraData,
        };
        await saveAdvert(advert);
        push(`/post/${advertDetails.id}`);
    }

    render() {
        const { countries, states, userInfo, skyPrices, advertDetails } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/dashboard' text='Dashboard' />
                {advertDetails.type === ADVERT_BUY && <PostingBuyForm
                    editMode
                    enableReinitialize
                    initialValues={mapAdvertDetailsToForm(advertDetails)}
                    countries={countries}
                    states={states}
                    onSubmit={this.onSubmit}
                    defaultCountry={userInfo ? userInfo.countryCode : undefined} />}

                {advertDetails.type === ADVERT_SELL && <PostingSellForm
                    editMode
                    enableReinitialize
                    initialValues={mapAdvertDetailsToForm(advertDetails)}
                    countries={countries}
                    states={states}
                    skyPrices={skyPrices}
                    onSubmit={this.onSubmit}
                    defaultCountry={userInfo ? userInfo.countryCode : undefined} />}
            </Container>
        )
    }
}

const mapStateToProps = ({ app, advertDetails }) => ({
    countries: app.countries,
    states: app.states,
    skyPrices: app.skyPrices,
    userInfo: app.userInfo,
    advertDetails,
});

export default connect(mapStateToProps, { push, requestAdvertDetails, saveAdvert })(PostingsBuy);
