import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
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

export default class FormDropdown extends React.Component {
    componentDidMount() {
        // ReduxForm doesn't have a prop for 'defaultValue'. You need to set it manually.
        const { defaultValue, input: { onChange } } = this.props;
        onChange(defaultValue);
    }

    render() {
        const { label, isRequired, options, input: { name, onChange }, meta: { error, warning, touched }, defaultValue } = this.props;

        const showError = touched && (error || warning);

        return (
            <Wrapper>
                {label &&
                    <FormLabel for={name}>
                        {label}
                        {isRequired && '*'}
                    </FormLabel>
                }
                <SelectWrapper>
                    <Select name={name} error={showError} onChange={onChange} defaultValue={defaultValue} >
                        {options.map((item, i) => <option value={item.value} key={i}>{item.text}</option>)}
                    </Select>
                </SelectWrapper>
                {showError && <ErrorMessage>{error || warning}</ErrorMessage>}
            </Wrapper>
        );
    }
}

FormDropdown.propTypes = {
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    options: PropTypes.array,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
    defaultValue : PropTypes.any,
}
