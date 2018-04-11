import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';


import Container from 'components/layout/Container';
import { SellButton, BuyButton } from 'components/layout/Button';
import bg from './bg.png';

const Title = styled.h2`
    margin-top: 90px;
    font-size: 28px;
`

const Tip = styled.p`
    margin-top: 12px;
    font-size: 18px;
`

const ActionText = styled.p`
    margin-top: 60px;
    margin-bottom: 29px;
    font-size: 18px;
    color: ${props => props.theme.colors.grayBlue};
    text-transform: uppercase;
`

const BgImg = styled.img`
    position: absolute; 
    width: ${props => props.theme.container.width};
    max-width: ${props => props.theme.container.maxWidth};
    height: 400px;
    z-index: -1;
`

const Promo = styled.section`
    background-repeat: no-repeat;
    background-position: center; 
    color: ${props => props.theme.colors.white};
    height: 400px;
    text-align: center;
`;

export default () => (
    <Container flexDirection="column" py={4}>
        <BgImg src={bg} />
        <Promo>
            <Title>Can't find the advert for you?</Title>
            <Tip>If you can't see a buyer or seller that is offering what you want, you can post your own advert.</Tip>
            <ActionText>I want to advertise to</ActionText>
            <Flex justifyContent={'center'}>
                <Box mr={'15px'}>
                    <SellButton text={'Sell Skycoin'} />
                </Box>
                <Box ml={'15px'}>
                    <BuyButton text={'Buy Skycoin'} />
                </Box>
            </Flex>
        </Promo>
    </Container>
);
