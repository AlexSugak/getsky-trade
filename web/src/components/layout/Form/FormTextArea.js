import React from 'react';
import PropTypes from 'prop-types';

import FormItem from './FormItem';

import { Tip } from '../Text';
import TextArea from '../TextArea';

const textAreaStyles = { height: 100 };

const FormTextArea = ({ label, tip, isRequired, description, placeholder, meta: { touched, error, warning }, input: { name, onChange } }) => {
    const showError = !!(touched && (error || warning));

    return (
        <FormItem name={name} label={label} isRequired={isRequired} showError={showError} error={error}>
            <TextArea name={name} style={textAreaStyles} placeholder={placeholder} onChange={onChange} />
            {tip && <Tip>{tip}</Tip>}
        </FormItem>
    );
};

FormTextArea.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
    label: PropTypes.string,
    tip: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    description: PropTypes.string,
}

export default FormTextArea;
