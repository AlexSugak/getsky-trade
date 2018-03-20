import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Container from '../Container';

const Promo = styled.section`
    border-bottom: 1px solid ${props => props.theme.colors.white};
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
    text-align: center;
`;

const PromoButton = styled(Link) `
    display: inline-block;
    border: 4px solid ${props => props.theme.colors.white};
    margin: 0 10px;
    padding: 10px 34px;
    transition: 200ms all ease-in-out;
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.black};

    &:hover {
        color: ${props => props.theme.colors.white};
        background: ${props => props.theme.colors.black};
    }
    
    span {
        font-size: 16px;
    }

    strong {
        display: block;
        font-size: 34px;
        margin-top: 5px;
        text-transform: uppercase;
    }
`;

export default () => (
    <Promo className="promo">
        <Container flexDirection="column" py={4}>
            <h2>Can't find the advert for you?</h2>
            <p>If you can't see a buyer or seller that is offering what you want, you can post your own advert.</p>
            <div>
                <PromoButton to="/postings/buy">
                    <span>I want to advertise to</span>
                    <strong>Buy Skycoin</strong>
                </PromoButton>
                <PromoButton to="/">
                    <span>I want to advertise to</span>
                    <strong>Sell Skycoin</strong>
                </PromoButton>
            </div>
        </Container>
    </Promo>
);
