import React from 'react';
import { Flex, Box } from 'grid-styled';
import { connect } from 'react-redux';
import styled from 'styled-components';

import theme from 'components/theme';
import Container from 'components/layout/Container';
import Icon, { IconMap } from 'components/layout/Icon';
import { TRADE_OPTIONS } from 'constants/index'
import Spinner from 'components/layout/Spinner';
import Messages from './Messages';

import {
    requestAdvertDetails,
} from './actions';

const Panel = styled(Flex) `
    margin-bottom: 30px;
    margin-right: 80px;
`;

const PanelBody = styled(Box) `
    background-color: ${theme.colors.lightGray2};
    padding-left: ${props => props.theme.spaces[5]}px;
    width: 100%;
`;

const Focused = styled.span`
    color: ${props => props.theme.colors.blue};
`;

export const advertTypes = {
    '1': 'sell',
    '2': 'buy',
};

const PositionName = styled(Box) `
    font-size: ${props => props.theme.fontSizes[1]}px;
    font-weight: bold;
    color: ${props => props.theme.colors.grayBlue};
`;

const PositionValue = styled(Box) `
`;

const PositionRow = styled(Flex) `
    font-size: ${props => props.theme.fontSizes[3]}px;
    padding-top: ${props => props.theme.spaces[4]}px;
    padding-bottom: ${props => props.theme.spaces[4]}px;
    padding-right: ${props => props.theme.spaces[4]}px;
    border-bottom: 1px solid ${props => props.theme.colors.separator};
`;

const SummaryPosition = ({ name, children }) => (
    <PositionRow flexDirection="row" width={1}>
        <PositionName width={1 / 3}>
            {name}
        </PositionName>
        <PositionValue width={2 / 3}>
            {children}
        </PositionValue>
    </PositionRow>
);

const advertValueToString = (amountFrom, amountTo, price = 1) => {
    if (!amountTo) {
        return amountFrom.times(price).toString();
    }

    return `${amountFrom.times(price).toString()} to ${amountTo.times(price).toString()}`;
};

const TradeOptionsList = styled.ul`
    list-style: none;
    svg {
        margin-right: 10px;
        width: 20px;
        height: 19px;
        color: ${props => props.theme.colors.grayBlue};
    }

    li {
        font-size: ${props => props.theme.fontSizes[1]}px;
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

const AdditionalInfo = styled.p`
    font-size: ${props => props.theme.fontSizes[1]}px;
    margin: 0;
    line-height: 20px;
`;

const Location = styled.p`
    margin: 0;
    font-size: ${props => props.theme.fontSizes[1]}px;
`;

const Country = styled.p`
    margin: 0;
    margin-top: ${props => props.theme.spaces[1]}px;
    font-size: ${props => props.theme.fontSizes[1]}px;
    font-weight: 300;
`;

export const AdvertSummary = ({ details, countries, states, skyPrices }) => (
    <Panel flexDirection="row" flexWrap="wrap">
        <PanelBody>
            <Flex flexDirection="row" flexWrap="wrap">
                <PositionRow width={1}>
                    <span>
                        <Focused> {details.author} </Focused> wants to <Focused> {advertTypes[details.type]} </Focused> Skycoin
                    </span>
                </PositionRow>
                <SummaryPosition
                    name="Will sell:">
                    <Focused>{advertValueToString(details.amountFrom, details.amountTo)} SKY</Focused>
                </SummaryPosition>
                <SummaryPosition
                    name="Which is approximately:">
                    <Focused> {advertValueToString(details.amountFrom, details.amountTo, details.fixedPrice || skyPrices[details.currency])} {details.currency}</Focused>
                </SummaryPosition>
                <SummaryPosition
                    name="Price per SKY:">
                    <Focused> {details.fixedPrice || skyPrices[details.currency]} {details.currency}</Focused>
                </SummaryPosition>
                <SummaryPosition
                    name="Trade options:">
                    <TradeOptions details={details} />
                </SummaryPosition>
                <SummaryPosition
                    name="Other information:">
                    <AdditionalInfo>{details.additionalInfo}</AdditionalInfo>
                </SummaryPosition>
                <SummaryPosition
                    name="Location:">
                    <Location>
                        Can travel {details.travelDistance} {distanceUnits[details.travelDistanceUoM]} from location
                    </Location>
                    <Country>
                        {getLocationByCode(countries, details.countryCode)}: {details.city} {getLocationByCode(states, details.stateCode)} {details.postalCode}
                    </Country>
                </SummaryPosition>
            </Flex>
        </PanelBody>
    </Panel >
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
    }
)(class extends React.Component {
    async componentWillMount() {
        const {
            advertDetails,
            match,

            requestAdvertDetails,
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
            <Container flexDirection="row" flexWrap="wrap">
                <h2>Advert summary</h2>
                <Flex>
                    <Box width={[1, 1 / 2]}>
                        <AdvertSummary
                            details={advertDetails}
                            skyPrices={app.skyPrices}
                            countries={app.countries}
                            states={app.states} />
                    </Box>
                    <Box width={[1, 1 / 2]}>
                        {app.userInfo
                            && (<Flex flexDirection="row" flexWrap="wrap">
                                <Messages advert={advertDetails} />
                            </Flex>)
                        }
                    </Box>
                </Flex>
            </Container>);
    }
});
