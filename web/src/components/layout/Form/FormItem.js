import React from 'react';
import PropTypes from 'prop-types';

import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
import ControlMessage from './ControlMessage';

const FormItem = ({ name, label, isRequired, description, showError, error, children }) => (
    <Wrapper>
        {label &&
            <FormLabel for={name}>
                {label}
                {isRequired && '*'}
            </FormLabel>
        }
        {children}
        {!showError && description && <ControlMessage>{description}</ControlMessage>}
        {showError && <ErrorMessage>{error}</ErrorMessage>}
    </Wrapper>
);


FormItem.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    description: PropTypes.string,
    showError: PropTypes.bool,
    error: PropTypes.string
};

export default FormItem;
