import React from 'react';
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
    render() {
        const { label, isRequired, options, input, meta: { error, warning, touched }, ...props } = this.props;

        const showError = touched && (error || warning);

        return(
            <Wrapper>
                {label &&
                <FormLabel for={input.name}>
                    {label}
                    {isRequired && '*'}
                </FormLabel>
                }
                <SelectWrapper>
                    <Select name={input.name} error={showError} { ...input } { ...props }>
                        {options.map((item, i) => <option value={item.value} key={i}>{item.text}</option>)}
                    </Select>
                </SelectWrapper>
                {showError && <ErrorMessage>{ error || warning }</ErrorMessage>}
            </Wrapper>
        );
    }
}