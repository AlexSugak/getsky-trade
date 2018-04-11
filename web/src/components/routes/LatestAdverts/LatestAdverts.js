import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import keys from 'lodash/keys';
import values from 'lodash/values';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';

import Icon, { IconMap } from 'components/layout/Icon';
import Promo from 'components/layout/Promo';
import { NewMessageCount } from 'components/layout/Badge';
import Container from 'components/layout/Container';
import Table, { TableRow, TableCell } from 'components/layout/Table';
import { TRADE_OPTIONS } from 'constants/index';
import Spinner from 'components/layout/Spinner';
import ActionButton from 'components/layout/Button/ActionButton';

import { Tab, Tabs, TabList, TabPanel } from './Tabs';
import { getAdverts } from './actions';
import bgImage from './intro-bg.png';

const Intro = styled.div`
    background: ${props => props.theme.colors.black} url(${bgImage}) 50% 20% no-repeat;
    background-size: cover;
    padding: ${props => props.theme.spaces[8] * 2}px 0 ${props => props.theme.introTabsHeight + props.theme.spaces[8] * 2}px;
    color: ${props => props.theme.colors.white};
    
    h1 {
        font-family: ${props => props.theme.fontBold};
        font-size: 38px;
        line-height: 44px;
        padding-top: 10px;
    }
    
    p {
        max-width: 650px;
        font-size: ${props => props.theme.fontSizes[2]}px;
        line-height: 30px;
    }
`;

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
        {advert.totalMessagesAmount !== undefined &&
            <NewMessageCount newMessages={advert.newMessagesAmount} totalMessages={advert.totalMessagesAmount} />
        }
        <strong className="name">{advert.author}</strong>
        {advert.countryCode}, <span>{advert.city} {advert.stateCode} {advert.postalCode}</span>
    </Author>
);

const LinkedTableRow = styled(withRouter(({ ...props, href, history }) =>
    (<TableRow {...props} onClick={() => history.push(href)} />))) `
        &:hover {
            cursor: pointer;
            background-color: rgba(0,0,0, 0.1);
        }
    `;

export const buyAdvertsColumns = [
    { name: 'Seller' },
    { name: 'Will sell' },
    { name: 'Trade options' },
    { name: 'Expired' },
];

export const BuyAdvertRow = ({ data, rowOperations }) => {
    const advert = data;
    return (
        <LinkedTableRow href={`/post/${advert.id}`}>
            <TableCell><AuthorCell advert={advert} /></TableCell>
            <TableCell>{advert.amountFrom} {advert.amountTo ? `- ${advert.amountTo}` : ''} SKY</TableCell>
            <TableCell>{getTradeOptionsText(advert)}</TableCell>
            <TableCell>{moment(advert.expiredAt).format('DD MMMM YY')}</TableCell>
            {rowOperations && (rowOperations.extendAdvert || rowOperations.deleteAdvert)
                && <TableCell>
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.extendAdvert(advert);
                        }}
                        tip="Extend"
                        icon={<Icon name={IconMap.Clock} />} />
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.editAdvert(advert);
                        }}
                        tip="Edit"
                        icon={<Icon name={IconMap.PencilSquare} />} />
                    <ActionButton
                        isDanger={true}
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.deleteAdvert(advert);
                        }}
                        tip="Delete"
                        icon={<Icon name={IconMap.Trash} />} />
                </TableCell>}
        </LinkedTableRow>
    );
}

export const sellAdvertsColumns = [
    { name: 'Buyer' },
    { name: 'Will pay' },
    { name: 'Trade options' },
    { name: 'Expired' },
];

export const SellAdvertRow = ({ data, rowOperations }) => {
    const advert = data;
    return (
        <LinkedTableRow href={`/post/${advert.id}`}>
            <TableCell><AuthorCell advert={advert} /></TableCell>
            <TableCell>{advert.amountFrom} {advert.amountTo ? `- ${advert.amountTo}` : ''} SKY</TableCell>
            <TableCell>{getTradeOptionsText(advert)}</TableCell>
            <TableCell>{moment(advert.expiredAt).format('DD MMMM YY')}</TableCell>
            {rowOperations && (rowOperations.extendAdvert || rowOperations.deleteAdvert)
                && <TableCell>
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.extendAdvert(advert);
                        }}
                        tip="Extend"
                        icon={<Icon name={IconMap.Clock} />} />
                    <ActionButton
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.editAdvert(advert);
                        }}
                        tip="Edit"
                        icon={<Icon name={IconMap.PencilSquare} />} />
                    <ActionButton
                        isDanger={true}
                        onClick={e => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            rowOperations.deleteAdvert(advert);
                        }}
                        tip="Delete"
                        icon={<Icon name={IconMap.Trash} />} />
                </TableCell>}
        </LinkedTableRow>
    );
}

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
                <Tabs>
                    <TabList>
                        <Tab><strong>Buy Skycoin</strong></Tab>
                        <Tab><strong>Sell Skycoin</strong></Tab>
                    </TabList>
                    <TabPanel>
                        <Container flex='1 0 auto' flexDirection="column" pb={4}>
                            {this.props.loading && <Spinner />}
                            <Table columns={buyAdvertsColumns} rowComponent={BuyAdvertRow} rowData={this.props.sellAdverts} />
                        </Container>
                    </TabPanel>
                    <TabPanel>
                        <Container flex='1 0 auto' flexDirection="column" pb={4}>
                            {this.props.loading && <Spinner />}
                            <Table columns={sellAdvertsColumns} rowComponent={SellAdvertRow} rowData={this.props.buyAdverts} />
                        </Container>
                    </TabPanel>
                </Tabs>
                <Promo />
            </div>
        );
    }
}

export default connect(state => state.latestAdverts, ({ getAdverts }))(LatestAdverts);
