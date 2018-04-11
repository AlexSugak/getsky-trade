import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BaseButton from './BaseButton';

const Button = styled(BaseButton) `
    background: ${props => props.primary ? props.theme.colors.blue : props.theme.colors.mint};
    color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.black};
    border-color: ${props => props.primary ? props.theme.colors.blue : props.theme.colors.mint};
    font-family: ${props => props.primary ? props.theme.fontLight : props.theme.fontBold};

    &:hover {
        opacity: 0.7;
    }
`;

const ButtonControl = ({ text, type, disabled, onClick, style, primary, className }) => (
    <Button
        className={className}
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={style}
        primary={primary}>
        {text}
    </Button>
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
