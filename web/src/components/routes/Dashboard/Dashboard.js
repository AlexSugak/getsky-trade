import React from 'react';
import { connect } from 'react-redux';

import Container from 'components/layout/Container';
import DashboardTitle from './DashboardTitle';
import Counters from './Counters';
import AdvertsList from './AdvertsList';

class Dashboard extends React.Component {
    render() {
        const { userName } = this.props;

        return (
            <Container flex='1 0 auto' flexDirection="column">
                <DashboardTitle userName={userName} />
                <Counters />
                <AdvertsList />
            </Container>
        );
    }
};

const mapStateToProps = ({ app }) => ({
    userName: app.userInfo ? app.userInfo.username : '',
});

export default connect(mapStateToProps)(Dashboard);
