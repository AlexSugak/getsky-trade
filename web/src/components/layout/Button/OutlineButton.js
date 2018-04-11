import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BaseButton from './BaseButton';

const Button = styled(BaseButton) `
    background: transparent;
    color: ${props => props.reverse ? props.theme.colors.white : props.theme.colors.darkBlue};
    border-color: ${props => props.reverse ? props.theme.colors.white : props.theme.colors.darkBlue};

    &:hover {
        color: ${props => props.theme.colors.blue};
        border-color: ${props => props.theme.colors.blue};
    }
`;

const ButtonControl = ({ text, type, disabled, onClick, style, reverse, className }) => (
    <Button
        className={className}
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={style}
        reverse={reverse}>
        {text}
    </Button>
);

ButtonControl.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    reverse: PropTypes.bool,
    className: PropTypes.string,
};

export default ButtonControl;
