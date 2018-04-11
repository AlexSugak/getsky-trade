import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const WhiteText = styled.span`
    color: ${props => props.theme.colors.white};
    font-size: ${props => props.theme.logoSize}px;
`

const BlueText = styled.span`
    color: ${props => props.theme.colors.blue};
    font-size: ${props => props.theme.logoSize}px;
`

const Brand = styled(Link) `
    display: block;
    transform: scale(1, 1.25);
    -webkit-transform: scale(1, 1.25); /* Safari and Chrome */
    -moz-transform: scale(1, 1.25); /* Firefox */
    -ms-transform: scale(1, 1.25); /* IE 9+ */
    -o-transform: scale(1, 1.25); /* Opera */
    letter-spacing: 3px;
`;

export default () => (
    <Brand to="/">
        <WhiteText>BUY</WhiteText>
        <BlueText>SKY</BlueText>
    </Brand>
);
