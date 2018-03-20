import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import keys from 'lodash/keys';
import values from 'lodash/values';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import { Tab as UnstyledTab, Tabs, TabList as UnstyledTabList, TabPanel } from 'react-tabs';
import { getAdverts } from './actions';
import Promo from '../../layout/Promo';
import Container from '../../layout/Container';
import Table, { TableRow, TableCell } from '../../layout/Table';
import { TRADE_OPTIONS } from '../../../constants';

import bgImage from './intro-bg.jpg';

const Intro = styled.div`
    background: ${props => props.theme.colors.black} url(${bgImage}) 50% 20% no-repeat;
    background-size: cover;    
    padding: ${props => props.theme.spaces[8] * 2}px 0 ${props => props.theme.introTabsHeight + props.theme.spaces[8] * 2}px;
    color: ${props => props.theme.colors.white};
    text-align: center;
    
    h1 {
        font-family: ${props => props.theme.fontBold}
    }
    
    p {
        max-width: 650px;
        margin: auto;
        font-size: ${props => props.theme.fontSizes[3]}px;
        line-height: 1.4;
    }
`;

const TabList = styled(UnstyledTabList) `
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: ${props => props.theme.introTabsHeight}px;
    margin-top: -${props => props.theme.introTabsHeight}px;
`;

const Tab = styled(UnstyledTab) `
    display: flex;
    flex-direction: column;
    justify-content: center;
    list-style: none;
    height: ${props => props.theme.introTabsHeight}px;
    padding: 0 ${props => props.theme.spaces[4]}px;
    margin: 0 2px;
    border-radius: 3px 3px 0 0;
    background-color: ${props => props.selected ? props.theme.colors.white : props.theme.colors.black};
    color: ${props => props.selected ? props.theme.colors.black : props.theme.colors.white};
    font-size: ${props => props.theme.fontSizes[1]}px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    
    strong {
        display: block;
        font-size: ${props => props.theme.fontSizes[4]}px;
        margin-top: ${props => props.theme.spaces[0]}px;
    }
`;

TabList.tabsRole = 'TabList';
Tab.tabsRole = 'Tab';

const Author = styled.div`
    .name {
        display: block;
        margin-bottom: ${props => props.theme.spaces[0]}px;
        font-family: ${props => props.theme.fontBold};
    }
`;

const getTradeOptionsText = advert => {
    const advertOptions = pickBy(pick(advert, keys(TRADE_OPTIONS)), item => item);
    return values(pick(TRADE_OPTIONS, keys(advertOptions))).join(', ');
};

const AuthorCell = ({ advert }) => (
    <Author>
        <strong className="name">{advert.author}</strong>
        {advert.countryCode}, <span>{advert.city} {advert.stateCode} {advert.postalCode}</span>
    </Author>
);

const buyAdvertsColumns = [
    { name: 'Seller' },
    { name: 'Will sell' },
    { name: 'Trade options' },
    { name: 'Created' },
];

const BuyAdvertRow = (advert) => (
    <TableRow>
        <TableCell><AuthorCell advert={advert} /></TableCell>
        <TableCell>{advert.amountFrom} {advert.amountTo ? `- ${advert.amountTo}` : ''} {advert.currency}</TableCell>
        <TableCell>{getTradeOptionsText(advert)}</TableCell>
        <TableCell>{moment(advert.createdAt).format('DD MMMM YY')}</TableCell>
    </TableRow>
);

const sellAdvertsColumns = [
    { name: 'Buyer' },
    { name: 'Will pay' },
    { name: 'Trade options' },
    { name: 'Created' },
];

const SellAdvertRow = (advert) => (
    <TableRow>
        <TableCell><AuthorCell advert={advert} /></TableCell>
        <TableCell>{advert.amountFrom} {advert.amountTo ? `- ${advert.amountTo}` : ''} {advert.currency}</TableCell>
        <TableCell>{getTradeOptionsText(advert)}</TableCell>
        <TableCell>{moment(advert.createdAt).format('DD MMMM YY')}</TableCell>
    </TableRow>
);

class LatestAdverts extends React.Component {
    componentWillMount() {
        this.props.getAdverts();
    }

    render() {
        return (
            <div>
                <Intro className="intro">
                    <Container flexDirection="column">
                        <h1>Buy and sell Skycoin <br />person-to-person with cash, by mail,<br /> money order & more…</h1>
                        <p>We never store Skycoin on this site so your money can't be hacked or stolen. All transactions are completely peer-to-peer (seller to buyer) and no email is required.</p>
                    </Container>
                </Intro>
                <Container flex='1 0 auto' flexDirection="column" pb={4}>
                    <Tabs>
                        <TabList>
                            <Tab><span>I want to</span><strong>Buy Skycoin</strong></Tab>
                            <Tab><span>I want to</span><strong>Sell Skycoin</strong></Tab>
                        </TabList>
                        <TabPanel>
                            <Table columns={buyAdvertsColumns} rowComponent={BuyAdvertRow} rowData={this.props.sellAdverts} />
                        </TabPanel>
                        <TabPanel>
                            <Table columns={sellAdvertsColumns} rowComponent={SellAdvertRow} rowData={this.props.buyAdverts} />
                        </TabPanel>
                    </Tabs>
                </Container>
                <Promo />
            </div>
        );
    }
}

export default connect(state => state.latestAdverts, ({ getAdverts }))(LatestAdverts);
