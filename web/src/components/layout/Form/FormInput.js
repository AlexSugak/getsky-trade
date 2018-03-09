import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
import ControlMessage from './ControlMessage';
import { getBorderColor } from './helper';

const Control = styled.input`
    width: 100%;
    height: ${props => props.theme.controlHeight}px;
    padding: ${props => props.theme.spaces[0]}px ${props => props.theme.spaces[1]}px;
    border-width: 1px;
    border-style: solid;
    border-color: ${props => getBorderColor(props)};
    font-family: ${props => props.theme.fontLight};
    font-size: ${props => props.theme.fontSizes[1]}px;
    
    &:focus {
        outline: none;
        border: 1px solid ${props => rgba(props.theme.colors.black, 0.5)};
    }
`;

export default class FormInput extends React.Component {
    render() {
        const { label, placeholder, description, isRequired, type, maxLength, input, meta: { error, warning, touched }, ...props } = this.props;
        const showError = touched && (error || warning);

        return(
            <Wrapper>
                {label &&
                <FormLabel for={input.name}>
                    {label}
                    {isRequired && '*'}
                </FormLabel>
                }
                <Control name={input.name} type={type} placeholder={placeholder} maxLength={maxLength} error={showError} { ...input } { ...props } />
                {!showError && description && <ControlMessage>{description}</ControlMessage>}
                {showError && <ErrorMessage>{ error || warning }</ErrorMessage>}
            </Wrapper>
        );
    }
}