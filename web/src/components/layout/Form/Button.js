import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[3]}px;
    background: ${props => props.theme.colors.black};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.theme.colors.white};
    
    &:hover {
        cursor:pointer;
    }
`;

export default ({ text, type, disabled }) => (
    <Button type={type} disabled={disabled}>{text}</Button>
);