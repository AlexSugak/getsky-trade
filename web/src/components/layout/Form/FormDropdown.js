import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import Wrapper from './ControlWrapper';
import ControlDropdown from './ControlDropdown';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';
import { getBorderColor } from './helper';

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
                <ControlDropdown name={name} onChange={onChange} defaultValue={defaultValue} options={options} />
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
