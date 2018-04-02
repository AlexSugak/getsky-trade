import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { BuyButton, SellButton } from 'components/layout/Button';
import { Span, B } from 'components/layout/Text';

const DashboardTitle = ({ userName }) => (
    <Flex justifyContent='space-between' mt={3}>
        <Flex alignItems='center' >
            <Span>Hello, <B>{userName}</B></Span>
        </Flex>
        <Box width={230}>
            <Flex justifyContent='space-between'>
                <BuyButton />
                <SellButton />
            </Flex>
        </Box>
    </Flex>
);

DashboardTitle.propTypes = {
    userName: PropTypes.string,
};

export default DashboardTitle;
