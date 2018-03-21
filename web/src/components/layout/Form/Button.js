import React from 'react';
import PropTypes from 'prop-types';
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
    &:disabled {
        background: ${props => props.theme.colors.gray};
    }
`;

const ButtonControl = ({ text, type, disabled, onClick }) => (
    <Button type={type} disabled={disabled} onClick={onClick}>{text}</Button>
);

ButtonControl.propTypes = {
    text: PropTypes.string.isRequired, 
    type: PropTypes.string, 
    disabled: PropTypes.bool, 
    onClick: PropTypes.func,
};

export default ButtonControl;
