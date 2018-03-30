import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { BuyButton, SellButton } from 'components/layout/Button';

const DashboardTitle = ({ userName }) => (
    <Flex>
        <Box>
            {userName}
        </Box>
        <Box>
            <BuyButton />
            <SellButton />
        </Box>
    </Flex>
);

DashboardTitle.propTypes = {
    userName: PropTypes.string,
};

export default DashboardTitle;
