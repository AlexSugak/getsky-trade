import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled'
import 'font-awesome/css/font-awesome.min.css';

const CheckBoxInput = styled.input`
    font: normal normal normal 14px/1 FontAwesome;
    -webkit-appearance: none;
    background-color: white;
    color: black;
    border: 1px solid black;
    padding: 10px;
    display: inline-block;
    position: relative;
    outline: none;

    &:active, &:focus {
        border: 1px solid ${props => props.theme.colors.gray};
        outline: none;
    }
    &:checked:before {
        content: '\f00c';
        font-size: 16px;
        position: absolute;
        top: 2px;
        left: 2px;
        color: black;
    }
    + label {
        color: black;
    }
`;

const CheckBox = ({ labelText, checked, onClick }) => {
    return (
        <Flex alignItems='center'>
            <Box>
                <CheckBoxInput type="checkbox" checked={checked} onClick={onClick} />
            </Box>
            <Box ml={1}>
                <label>{labelText}</label>
            </Box>
        </Flex>
    )
};

CheckBox.propTypes = {
    labelText: PropTypes.string, 
    checked: PropTypes.bool, 
    onClick: PropTypes.func,
};

export default CheckBox;
