import React from 'react';

import Container from '../Container';
import ControlDropdown from './ControlDropdown';
import ControlInput from './ControlInput';
import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
 
export default class FormDropdownInput extends React.Component {
    componentDidMount() {
        const { defaultValue, input: { onChange } } = this.props;
        onChange(defaultValue);
    }

    render() {
        const { label, isRequired, options, input: { name }, meta: { error, warning, touched } } = this.props;
        const showError = touched && (error || warning);

        return (
            <Wrapper>
                {label &&
                    <FormLabel for={name}>
                        {label}
                        {isRequired && '*'}
                    </FormLabel>
                }
                <Container>
                    <ControlInput />
                    <ControlDropdown options={options} />
                </Container>
                {showError && <ErrorMessage>{error || warning}</ErrorMessage>}
            </Wrapper>
        );
    }
}
