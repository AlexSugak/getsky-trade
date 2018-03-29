import React from 'react';
import { Flex, Box } from 'grid-styled';
import { connect } from 'react-redux';
import styled from 'styled-components';

import theme from 'components/theme';
import Container from 'components/layout/Container';
import { B } from 'components/layout/Text';
import Icon, { IconMap } from 'components/layout/Icon';
import { TRADE_OPTIONS } from 'constants/index'
import Spinner from 'components/layout/Spinner';

import {
    requestAdvertDetails,
    requestSkycoinPrice,
} from './actions';

const Panel = styled(Flex) `
    margin: 30px 0;
    margin-right: 80px;
`;
const PanelHeading = styled(Box) `
    width: 100%;
    text-align: center;
    font-size: 18px;
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
`;
const PanelBody = styled(Box) `
    background-color: ${theme.colors.lightGray};
    width: 100%;
    padding: 30px 30px;

    ${Flex} {
        border-bottom: 2px solid ${theme.colors.lightGray};
    }
`;

export const advertTypes = {
    '1': 'sell',
    '2': 'buy',
};

const PositionName = styled(Box) `
    text-align: right;
    color: ${theme.colors.white};
    background-color: ${theme.colors.black};
    padding: 15px 15px;
    font-size: 18px;
`;

const PositionValue = styled(Box) `
    text-align: left;
    color: ${theme.colors.black};
    background-color: ${theme.colors.white};
    padding: 15px 15px;
`;

const SummaryPosition = ({ name, children }) => (
    <Flex flexDirection="row" width={1}>
        <PositionName width={1 / 3}>
            {name}
        </PositionName>
        <PositionValue width={2 / 3}>
            {children}
        </PositionValue>
    </Flex>
);

// Taken from http://www.jacklmoore.com/notes/rounding-in-javascript/
const round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

const advertValueToString = (amountFrom, amountTo, price = 1) => {
    if (!amountTo) {
        return round(amountFrom / price, 3);
    }

    return `${round(amountFrom / price, 3)} to ${round(amountTo / price, 3)}`;
};

const TradeOptionsList = styled.ul`
    list-style: none;
    svg {
        margin-right: 10px;
    }

    li {
        margin-top: 5px;
    }
`;

const TradeOptions = ({ details }) => (
    <TradeOptionsList>
        {details.tradeCashInPerson
            && <li><Icon name={IconMap.CheckCircle} /> {TRADE_OPTIONS.tradeCashInPerson} </li>}
        {details.tradeCashByMail
            && <li><Icon name={IconMap.CheckCircle} /> {TRADE_OPTIONS.tradeCashByMail} </li>}
        {details.tradeMoneyOrderByMail
            && <li><Icon name={IconMap.CheckCircle} /> {TRADE_OPTIONS.tradeMoneyOrderByMail}</li>}
        {details.tradeOther
            && <li><Icon name={IconMap.CheckCircle} /> {TRADE_OPTIONS.tradeOther}</li>}
    </TradeOptionsList>
);

const distanceUnits = {
    mi: 'miles',
    km: 'kilometers',
};

const getLocationByCode = (locations, code) => {
    const l = locations.find(l => l.value === code);
    if (l) return l.text;
    return code;
}

export const AdvertSummary = ({ details, countries, states, skyPrice }) => (
    <Panel flexDirection="row" flexWrap="wrap">
        <PanelHeading width={1}>
            <h3>{details.author} wants to {advertTypes[details.type]} Skycoin</h3>
        </PanelHeading>
        <PanelBody>
            <Flex flexDirection="row" flexWrap="wrap">
                <SummaryPosition
                    name="Will sell:">
                    <B>{advertValueToString(details.amountFrom, details.amountTo)} {details.currency}</B>
                </SummaryPosition>
                <SummaryPosition
                    name="Which is approximately:">
                    {advertValueToString(details.amountFrom, details.amountTo, details.fixedPrice || details.price)} SKY
                </SummaryPosition>
                <SummaryPosition
                    name="Price per SKY:">
                    {details.fixedPrice || round(skyPrice, 3)} {details.currency}
                </SummaryPosition>
                <SummaryPosition
                    name="Trade options:">
                    <TradeOptions details={details} />
                </SummaryPosition>
                <SummaryPosition
                    name="Other information:">
                    {details.additionalInfo}
                </SummaryPosition>
                <SummaryPosition
                    name="Location:">
                    {getLocationByCode(countries, details.countryCode)}: {details.city} {getLocationByCode(states, details.stateCode)} {details.postalCode}
                    <p>
                        <B>
                            Can travel {details.travelDistance} {distanceUnits[details.travelDistanceUoM]} from location
                        </B>
                    </p>
                </SummaryPosition>
            </Flex>
        </PanelBody>
    </Panel>
);

const NotFound = () =>
    (<Container>
        <h2>Advert not found or no longer exists.</h2>
    </Container>);

export default connect(
    ({
        advertDetails,
        app,
    }) => ({
        advertDetails,
        app,
    }),
    {
        requestAdvertDetails,
        requestSkycoinPrice,
    }
)(class extends React.Component {
    async componentWillMount() {
        const {
            advertDetails,
            match,

            requestAdvertDetails,
            requestSkycoinPrice,
        } = this.props;

        if (advertDetails.id !== match.params.id) {
            const details = await requestAdvertDetails(match.params.id);
            if (!details) return;
        }
    }
    render() {
        const { advertDetails, app } = this.props;

        if (advertDetails.notFound) return <NotFound />;

        if (advertDetails.loading) return <Spinner />;

        return (
            <Container>
                <Box width={[1, 2 / 3]}>
                    <h2>Advert summary</h2>
                    <AdvertSummary
                        details={advertDetails}
                        skyPrice={app.skyPrice}
                        countries={app.countries}
                        states={app.states} />
                </Box>
                <Box width={[1, 1 / 3]}>
                </Box>
            </Container>);
    }
});
