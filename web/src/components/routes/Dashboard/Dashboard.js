import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';
import { SellAdvertRow, sellAdvertsColumns, BuyAdvertRow, buyAdvertsColumns } from 'components/routes/LatestAdverts';
import DashboardTitle from './DashboardTitle';
import Counters from './Counters';
import AdvertsList, { RightCornerButton } from './AdvertsList';
import ExtendConfirm from './ExtendConfirm';
import DeleteConfirm from './DeleteConfirm';
import { getAdverts, extendExpirationDate, deleteAdvert } from './actions';

const lengthOrZero = collection => collection ? collection.length : 0;

class Dashboard extends React.Component {
    state = {
        extendConfirmationVisible: false,
        deleteConfirmationVisible: false,
        selectedAdvert: {},
    }

    toggleExtendConfirmation = advert => {
        this.setState(() => ({
            extendConfirmationVisible: !this.state.extendConfirmationVisible,
            selectedAdvert: advert || {},
        }));
    }

    extendAdvert = () => {
        this.toggleExtendConfirmation();
        this.props.extendExpirationDate(this.state.selectedAdvert.id);
    }
    deleteAdvert = () => {
        this.props.deleteAdvert(this.state.selectedAdvert.id);
        this.toggleDeleteConfirmation();

    }
    toggleDeleteConfirmation = advert => {
        this.setState({
            ...this.state,
            deleteConfirmationVisible: !this.state.deleteConfirmationVisible,
            selectedAdvert: advert,
        });
    }

    componentDidMount() {
        this.props.getAdverts();
    }

    render() {
        const { userName, buyAdverts, sellAdverts, buyEnquiries, sellEnquiries, newMessages, enquiriesToBuyers, enquiriesToSellers } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection="column">
                <ExtendConfirm
                    isOpen={this.state.extendConfirmationVisible}
                    onConfirm={this.extendAdvert}
                    onClose={this.toggleExtendConfirmation}
                    advert={this.state.selectedAdvert}
                />
                <DeleteConfirm
                    isOpen={this.state.deleteConfirmationVisible}
                    onConfirm={this.deleteAdvert}
                    onClose={this.toggleDeleteConfirmation}
                />
                <DashboardTitle userName={userName} />
                <Counters
                    buyAdverts={lengthOrZero(buyAdverts)}
                    sellAdverts={lengthOrZero(sellAdverts)}
                    buyEnquiries={enquiriesToBuyers}
                    sellEnquiries={enquiriesToSellers}
                    newMessages={newMessages}
                />
                <AdvertsList
                    rowOperations={{
                        deleteAdvert: this.toggleDeleteConfirmation,
                        extendAdvert: this.toggleExtendConfirmation,
                    }}
                    title={'Your buyer adverts'}
                    adverts={buyAdverts}
                    noAdvertsMessage={'You have no active buyer adverts.'}
                    columns={buyAdvertsColumns}
                    rowComponent={BuyAdvertRow}
                    rightCorner={RightCornerButton.BUY}
                />
                <AdvertsList
                    rowOperations={{
                        deleteAdvert: this.toggleDeleteConfirmation,
                        extendAdvert: this.toggleExtendConfirmation,
                    }}
                    title={'Your seller adverts'}
                    adverts={sellAdverts}
                    noAdvertsMessage={'You have no active seller adverts.'}
                    columns={sellAdvertsColumns}
                    rowComponent={SellAdvertRow}
                    rightCorner={RightCornerButton.SELL}
                />
                <AdvertsList
                    title={'Enquiries you\'ve made to buyers'}
                    adverts={buyEnquiries}
                    noAdvertsMessage={'There are no active buyer adverts you have made enquiries to.'}
                    columns={buyAdvertsColumns}
                    rowComponent={BuyAdvertRow}
                    rightCorner={RightCornerButton.NONE}
                />
                <AdvertsList
                    title={'Enquiries you\'ve made to sellers'}
                    adverts={sellEnquiries}
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
    enquiriesToBuyers: dashboard.enquiriesToBuyers,
    enquiriesToSellers: dashboard.enquiriesToSellers,
});

export default connect(mapStateToProps, { getAdverts, extendExpirationDate, deleteAdvert })(Dashboard);
