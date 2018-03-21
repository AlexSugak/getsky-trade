import React from 'react';

import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
import ControlInput from './ControlInput';
import ControlMessage from './ControlMessage';

export default class FormInput extends React.Component {
    render() {
        const { label, placeholder, description, isRequired, type, maxLength, input, meta: { error, warning, touched } } = this.props;
        const showError = touched && (error || warning);

        return (
            <Wrapper>
                {label &&
                    <FormLabel for={input.name}>
                        {label}
                        {isRequired && '*'}
                    </FormLabel>
                }
                <ControlInput name={input.name} type={type} placeholder={placeholder} maxLength={maxLength} error={showError} onChange={input.onChange} />
                {!showError && description && <ControlMessage>{description}</ControlMessage>}
                {showError && <ErrorMessage>{error || warning}</ErrorMessage>}
            </Wrapper>
        );
    }
}
