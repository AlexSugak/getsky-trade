import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { getAdverts } from './actions';
import Table, { TableRow, TableCell } from '../../layout/Table';

const buyAdvertsColumns = [
    { name: 'Seller' },
    { name: 'Will sell' },
    { name: 'Trade options' },
    { name: 'Created' },
];

const BuyAdvertRow = (advert) => (
    <TableRow>
        <TableCell>{advert.author}</TableCell>
        <TableCell>{advert.amountFrom} - {advert.amountTo || '?'} {advert.currency}</TableCell>
        <TableCell>{advert.tradeCashByMail ? 'Cash by mail' : ''} {advert.tradeCashInPerson ? 'Cash in person' : ''}</TableCell>
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
        <TableCell>{advert.author}</TableCell>
        <TableCell>{advert.amountFrom} - {advert.amountTo || '?'} {advert.currency}</TableCell>
        <TableCell>{advert.tradeCashByMail ? 'Cash by mail' : ''} {advert.tradeCashInPerson ? 'Cash in person' : ''}</TableCell>
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
                <h2>Buy skycoin</h2>
                <Table columns={buyAdvertsColumns} rowComponent={BuyAdvertRow} rowData={this.props.sellAdverts} />

                <h2>Sell skycoin</h2>
                <Table columns={sellAdvertsColumns} rowComponent={SellAdvertRow} rowData={this.props.sellAdverts} />
            </div>
        );
    }
}

export default connect(state => state.latestAdverts, ({ getAdverts }))(LatestAdverts);