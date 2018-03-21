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
    border-color: ${props => props.theme.colors.black};
    border-width: 1px;

    &:focus {
        outline: none;
    }
    &:hover {
        cursor:pointer;
        background: ${props => props.theme.colors.gray};
    }
    &:disabled {
        background: ${props => props.theme.colors.gray};
    }
`;

const ButtonControl = ({ text, type, disabled, onClick, style }) => (
    <Button type={type} disabled={disabled} onClick={onClick} style={style}>{text}</Button >
);

ButtonControl.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
};

export default ButtonControl;
