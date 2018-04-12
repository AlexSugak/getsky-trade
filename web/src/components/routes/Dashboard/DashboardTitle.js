import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { BuyButton, SellButton } from 'components/layout/Button';
import { H1 } from 'components/layout/Text';

const DashboardTitle = ({ userName }) => (
    <Flex justifyContent='space-between' alignItems={'center'} my={'5px'}>
        <Flex alignItems='center' >
            <H1>Hello, {userName}</H1>
        </Flex>
        <Box width={375}>
            <Flex justifyContent='space-between'>
                <BuyButton primary />
                <SellButton  />
            </Flex>
        </Box>
    </Flex>
);

DashboardTitle.propTypes = {
    userName: PropTypes.string,
};

export default DashboardTitle;
