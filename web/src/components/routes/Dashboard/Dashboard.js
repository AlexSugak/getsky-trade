import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';
import { SellAdvertRow, sellAdvertsColumns, BuyAdvertRow, buyAdvertsColumns } from 'components/routes/LatestAdverts';
import DashboardTitle from './DashboardTitle';
import Counters from './Counters';
import AdvertsList, { RightCornerButton } from './AdvertsList';
import { getAdverts } from './actions';

const lengthOrZero = collection => collection ? collection.length : 0;

class Dashboard extends React.Component {
    componentDidMount() {
        this.props.getAdverts();
    }
    render() {
        const { userName, buyAdverts, sellAdverts, buyEnquiries, sellEnquiries, newMessages } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection="column">
                <DashboardTitle userName={userName} />
                <Counters
                    buyAdverts={lengthOrZero(buyAdverts)}
                    sellAdverts={lengthOrZero(sellAdverts)}
                    buyEnquiries={lengthOrZero(buyEnquiries)}
                    sellEnquiries={lengthOrZero(sellEnquiries)}
                    newMessages={newMessages}
                />
                <AdvertsList
                    title={'Your buyer adverts'}
                    adverts={buyAdverts}
                    noAdvertsMessage={'You have no active buyer adverts.'}
                    columns={buyAdvertsColumns}
                    rowComponent={BuyAdvertRow}
                    rightCorner={RightCornerButton.BUY}
                />
                <AdvertsList
                    title={'Your seller adverts'}
                    adverts={sellAdverts}
                    noAdvertsMessage={'You have no active seller adverts.'}
                    columns={sellAdvertsColumns}
                    rowComponent={SellAdvertRow}
                    rightCorner={RightCornerButton.SELL}
                />
                <AdvertsList
                    title={'Enquiries you\'ve made to buyers'}
                    adverts={sellEnquiries}
                    noAdvertsMessage={'There are no active buyer adverts you have made enquiries to.'}
                    columns={buyAdvertsColumns}
                    rowComponent={BuyAdvertRow}
                    rightCorner={RightCornerButton.NONE}
                />
                <AdvertsList
                    title={'Enquiries you\'ve made to sellers'}
                    adverts={buyEnquiries}
                    noAdvertsMessage={'There are no active seller adverts you have made enquiries to.'}
                    columns={sellAdvertsColumns}
                    rowComponent={SellAdvertRow}
                    rightCorner={RightCornerButton.NONE}
                />
            </Container>
        );
    }
};

const mapStateToProps = ({ app, dashboard }) => ({
    userName: app.userInfo ? app.userInfo.username : '',
    buyAdverts: dashboard.buyAdverts,
    sellAdverts: dashboard.sellAdverts,
    buyEnquiries: dashboard.buyEnquiries,
    sellEnquiries: dashboard.sellEnquiries,
    newMessages: dashboard.newMessages,
});

export default connect(mapStateToProps, { getAdverts })(Dashboard);
