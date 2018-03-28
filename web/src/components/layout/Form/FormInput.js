import React from 'react';
import ControlInput from './ControlInput';
import FormItem from './FormItem';

const FormInput = (props) => {
    const { label, placeholder, description, isRequired, type, maxLength, input, meta: { error, warning, touched } } = props;
    const showError = !!(touched && (error || warning));

    return (
        <FormItem name={input.name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
            <ControlInput name={input.name} type={type} placeholder={placeholder} maxLength={maxLength} error={showError} onChange={input.onChange} />
        </FormItem>
    );
}

export default FormInput;
