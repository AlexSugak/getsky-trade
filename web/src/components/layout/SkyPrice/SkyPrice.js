import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import theme from 'components/theme';
import { round } from 'utils/';

const Text = styled(Box) `
    font-size: ${theme.fontSizes[0]}px;
    color: ${theme.colors.grayBlue};
`;

const Link = styled.a `
    font-size: ${theme.fontSizes[0]}px;
    color: ${theme.colors.grayBlue};
    text-decoration: underline;
`;

const SkyPrice = ({ skyPrices }) => {
    return (
        <Flex>
            <Text>
                <Link href="https://coinmarketcap.com/currencies/skycoin/"> Latest Skycoin (SKY) price:</Link>
            </Text>
            <Text ml={'12px'}>
                USD {round(skyPrices.USD, 3)}
            </Text>
            <Text ml={'12px'}>
                EUR {round(skyPrices.EUR, 3)}
            </Text>
        </Flex>
    );
};

SkyPrice.propTypes = {
    skyPrices: PropTypes.object.isRequired,
};

export default SkyPrice;
