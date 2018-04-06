import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

const BorderedBox = styled(Box) `
    border: 1px solid ${props => props.theme.colors.gray};
`;

const TopBox = styled(Box) `
    border-bottom: 1px solid ${props => props.theme.colors.gray};
`;

const LeftBox = styled(Box) `
    border-right: 1px solid ${props => props.theme.colors.gray};
`;

const CenterText = { textAlign: 'center' };

const Card = ({ width, title, totalAmount, leftTitle, leftAmount, rightTitle, rightAmount, tipMessage }) => (
    <BorderedBox width={width}>
        <TopBox flex='1 1 auto' p={2}>
            <Box style={CenterText}>{totalAmount}</Box>
            <Box style={CenterText}>{title}</Box>
        </TopBox>
        {!tipMessage &&
            <Flex>
                <LeftBox flex='1 1 auto' p={2}>
                    <Box style={CenterText}>{leftAmount}</Box>
                    <Box style={CenterText}>{leftTitle}</Box>
                </LeftBox>
                <Box flex='1 1 auto' p={2}>
                    <Box style={CenterText}>{rightAmount}</Box>
                    <Box style={CenterText}>{rightTitle}</Box>
                </Box>
            </Flex>
        }
        {tipMessage &&
            <Box style={CenterText} p={2}>
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
