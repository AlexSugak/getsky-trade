import React from 'react';
import { Box } from 'grid-styled';

import Container from 'components/layout/Container';
import Counters from './Counters';
import AdvertsList from './AdvertsList';

class Dashboard extends React.Component {
    render() {
        return (
            <Container flex='1 0 auto' flexDirection="column" >
                <Counters />
                <AdvertsList />
            </Container>
        );
    }
};

export default Dashboard;
