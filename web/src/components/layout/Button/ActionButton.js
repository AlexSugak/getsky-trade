import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grid-styled';

const Container = styled.div`
    display: inline-block;
    overflow: auto;
    z-index: 1000;

    .label {
        display: none;
        position: absolute;
        margin-left: 30px;
        height: 30px;
        padding: 8px;
        background: ${props => props.theme.colors.black};
        color: ${props => props.theme.colors.white};
    }
    &:hover {
        cursor: pointer;
    }
    &:hover > .label {
        display: block;
    }
`;

const Btn = styled.button`
    width: 30px;
    height: 30px;
    background: ${props => props.isDanger ? props.theme.colors.red : props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.gray};
`;

const ActionButton = ({ tip, icon, onClick, isDanger }) => (
    <Container onClick={onClick}>
        <Box className="label">
            {tip}
        </Box>
        <Btn isDanger={isDanger}>
            {icon}
        </Btn>
    </Container>
);

ActionButton.propTypes = {
    tip: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
    isDanger: PropTypes.bool,
};

export default ActionButton;
