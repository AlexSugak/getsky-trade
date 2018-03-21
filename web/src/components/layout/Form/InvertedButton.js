import React from 'react';
import styled from 'styled-components';

const InvertedButton = styled.button`
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[3]}px;
    background: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.theme.colors.black};
    
    &:hover {
        cursor:pointer;
    }
    &:disabled {
        color: ${props => props.theme.colors.gray};
    }
`;

export default ({ text, type, disabled, onClick }) => (
    <InvertedButton type={type} disabled={disabled} onClick={onClick}>{text}</InvertedButton>
);
