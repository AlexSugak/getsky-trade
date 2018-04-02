import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';
import { getAdverts } from './actions';
import DashboardTitle from './DashboardTitle';
import Counters from './Counters';
import AdvertsList from './AdvertsList';

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
                <AdvertsList />
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
