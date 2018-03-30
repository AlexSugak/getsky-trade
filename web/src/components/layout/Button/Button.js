import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.button`
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[3]}px;
    background: ${props => props.primary ? props.theme.colors.black : props.theme.colors.white};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.black};
    border-color: ${props => props.theme.colors.black};
    border-width: 1px;

    &:focus {
        outline: none;
    }
    &:hover {
        cursor:pointer;
        background: ${props => props.primary ? props.theme.colors.gray : props.theme.colors.lightGray};
    }
    &:disabled {
        background: ${props => props.primary ? props.theme.colors.gray : props.theme.colors.white};
        color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.black};
    }
`;

const ButtonControl = ({ text, type, disabled, onClick, style, primary, className }) => (
    <Button className={className} type={type} disabled={disabled} onClick={onClick} style={style} primary={primary}>{text}</Button>
);

ButtonControl.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    primary: PropTypes.bool,
    className: PropTypes.string,
};

export default ButtonControl;
