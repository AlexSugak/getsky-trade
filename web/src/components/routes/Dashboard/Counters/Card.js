import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import theme from 'components/theme';

const BorderedBox = styled(Box) `
    background-color: ${theme.colors.darkBlue};
    color: ${theme.colors.white};
`;

const TopBox = styled(Box) `
    border-bottom: 2px solid transparent;
    border-image: ${`linear-gradient( to right,${theme.colors.blue}, ${theme.colors.mint})`};
    border-image-slice: 1;
`;

const TopBoxTitle = styled(Box) `
    font-size: 56px;
    line-height: 54px;
`;

const TopBoxContent = styled(Box) `
    font-size: 18px;
    line-height: 18px;
    margin-top: 10px;
    text-transform: uppercase;
`;

const LeftBox = styled(Box) `
    color: ${theme.colors.blue};
`;

const RightBox = styled(Box) `
    color: ${theme.colors.mint};
`;

const BoxTitle = styled(Box)`
    font-size: 24px;
    line-height: 23px;
`;

const BoxContent = styled(Box)`
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
    padding-top: 5px;
`;

const CenterText = { textAlign: 'center' };

const Card = ({ width, title, totalAmount, leftTitle, leftAmount, rightTitle, rightAmount, tipMessage }) => (
    <BorderedBox width={width}>
        <TopBox flex='1 1 auto' p={'27px'}>
            <TopBoxTitle style={CenterText}>{totalAmount}</TopBoxTitle>
            <TopBoxContent style={CenterText}>{title}</TopBoxContent>
        </TopBox>
        {!tipMessage &&
            <Flex py={'21px'}>
                <LeftBox flex='1 1 auto'>
                    <BoxTitle style={CenterText}>{leftAmount}</BoxTitle>
                    <BoxContent style={CenterText}>{leftTitle}</BoxContent>
                </LeftBox>
                <RightBox flex='1 1 auto'>
                    <BoxTitle style={CenterText}>{rightAmount}</BoxTitle>
                    <BoxContent style={CenterText}>{rightTitle}</BoxContent>
                </RightBox>
            </Flex>
        }
        {tipMessage &&
            <Box style={CenterText} alignItems={'center'} pt={'35px'}>
                {tipMessage}
            </Box>
        }
    </BorderedBox>
);

Card.propTypes = {
    title: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    leftTitle: PropTypes.string,
    leftAmount: PropTypes.number,
    rightTitle: PropTypes.string,
    rightAmount: PropTypes.number,
    tipMessage: PropTypes.string,
};

export default Card;
