import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from 'grid-styled';

import Card from './Card';

const Counters = ({ buyAdverts, sellAdverts, buyEnquiries, sellEnquiries, newMessages }) => (
    <Flex justifyContent={'space-between'}>
        <Card
            width={1 / 3}
            title={'Adverts'}
            totalAmount={buyAdverts + sellAdverts}
            leftTitle={'as buyer'}
            leftAmount={buyAdverts}
            rightTitle={'as seller'}
            rightAmount={sellAdverts}
        />
        <Box width={1 / 3} mx={1}>
            <Card
                title={'Enquiries'}
                totalAmount={buyEnquiries + sellEnquiries}
                leftTitle={'as buyer'}
                leftAmount={buyEnquiries}
                rightTitle={'as seller'}
                rightAmount={sellEnquiries}
            />
        </Box>
        <Card
            width={1 / 3}
            title={'New messages'}
            totalAmount={newMessages}
            tipMessage={'You can view your new messages below'}
        />
    </Flex>
);

Counters.propTypes = {
    buyAdverts: PropTypes.number.isRequired,
    sellAdverts: PropTypes.number.isRequired,
    buyEnquiries: PropTypes.number.isRequired,
    sellEnquiries: PropTypes.number.isRequired,
    newMessages: PropTypes.number.isRequired,
};

export default Counters;
