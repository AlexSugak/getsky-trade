import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { getBorderColor } from './helper';

const SelectWrapper = styled.div`
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: ${props => props.theme.spaces[2]}px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 5px 0 5px;
        border-color: #000000 transparent transparent transparent;
        transform: translateY(-50%);
    }
`;

const Select = styled.select`
    width: 100%;
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[1]}px;
    border-width: 1px;
    border-style: solid;
    border-color: ${props => getBorderColor(props)};
    border-radius: 0;
    background: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    -webkit-appearance: none;
    
    &:focus {
        outline: none;
        border: 1px solid ${props => rgba(props.theme.colors.black, 0.5)};
    }
`;

const ControlDropdown = ({ name, options, defaultValue, onChange }) => (
    <SelectWrapper>
        <Select name={name} onChange={onChange} defaultValue={defaultValue} >
            {options.map((item, i) => <option value={item.value} key={i}>{item.text}</option>)}
        </Select>
    </SelectWrapper>
);

ControlDropdown.propTypes = {
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
    })),
};

export default ControlDropdown;
