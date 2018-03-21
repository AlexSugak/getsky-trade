import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { getBorderColor } from './helper';

const Control = styled.input`
    width: 100%;
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[1]}px;
    border-width: 1px;
    border-style: solid;
    border-color: ${props => getBorderColor(props)};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    
    &:focus {
        outline: none;
        border: 1px solid ${props => rgba(props.theme.colors.black, 0.5)};
    }
`;

const ControlInput = ({ name, type, placeholder, maxLength, showError, onChange }) => (
    <Control name={name} type={type} placeholder={placeholder} maxLength={maxLength} error={showError} onChange={onChange} />
);

export default ControlInput;
