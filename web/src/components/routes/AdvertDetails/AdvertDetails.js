import React from 'react';
import { Flex, Box } from 'grid-styled';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Container from 'components/layout/Container/';
import Icon, { IconMap } from 'components/layout/Icon';

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
    background-color: #000;
    color: #fff;
`;
const PanelBody = styled(Box) `
    background-color: gray;
    width: 100%;
    padding: 30px 30px;

    ${Flex} {
        border-bottom: 2px solid gray;
    }
`;

const advertTypes = {
    '1': 'sell',
    '2': 'buy',
};

const PositionName = styled(Box) `
    text-align: right;
    color: #fff;
    background-color: #000;
    padding: 15px 5px;
    font-size: 18px;
`;

const PositionValue = styled(Box) `
    text-align: left;
    color: #000;
    background-color: #fff;
    padding: 15px 5px;
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

const TradeOptions = ({ details }) => (
    <ul>
        {details.tradeCashInPerson && <li><Icon name={IconMap.CheckCircle} /> Cash in person</li>}
        {details.tradeCashByMail && <li><Icon name={IconMap.CheckCircle} /> Cash by mail</li>}
        {details.tradeMoneyOrderByMail && <li><Icon name={IconMap.CheckCircle} /> Money order by mail</li>}
        {details.tradeOther && <li><Icon name={IconMap.CheckCircle} /> Other</li>}
    </ul>
);

const distanceUnits = {
    mi: 'miles',
    km: 'kilometers',
};

const AdvertSummary = ({ details }) => (
    <Panel flexDirection="row" wrap>
        <PanelHeading width={1}>
            <h3>{details.author} wants to {advertTypes[details.type]} Skycoin</h3>
        </PanelHeading>
        <PanelBody>
            <Flex flexDirection="row" wrap>
                <SummaryPosition
                    name="Will sell:">
                    {advertValueToString(details.amountFrom, details.amountTo)} {details.currency}
                </SummaryPosition>
                <SummaryPosition
                    name="Which is approximately:">
                    {advertValueToString(details.amountFrom, details.amountTo, details.fixedPrice || details.price)} SKY
                </SummaryPosition>
                <SummaryPosition
                    name="Price per XMR:">
                    {details.fixedPrice || round(details.price, 3)} {details.currency}
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
                    {details.countryCode}: {details.city} {details.stateCode} {details.postalCode}
                    <p>
                        Can travel {details.travelDistance} {distanceUnits[details.travelDistanceUoM]} from location
                    </p>
                </SummaryPosition>
            </Flex>
        </PanelBody>
    </Panel>
);

export default connect(
    ({
        advertDetails,
    }) => ({
        advertDetails,
    }),
    {
        requestAdvertDetails,
        requestSkycoinPrice,
    }
)(class extends React.Component {
    async componentWillMount() {
        const { advertDetails, match, requestAdvertDetails, requestSkycoinPrice } = this.props;
        if (advertDetails.id !== match.params.id) {
            const details = await requestAdvertDetails(match.params.id);

            if (!details.fixedPrice) {
                await requestSkycoinPrice(details.currency);
            }
        }
    }
    render() {
        const { advertDetails } = this.props;
        console.log(advertDetails);
        return (
            <Container>
                <Box width={[1, 2 / 3]}>
                    <h2>Advert summary</h2>
                    <AdvertSummary details={advertDetails} />
                </Box>
                <Box width={[1, 1 / 3]}>
                </Box>
            </Container>);
    }
});
