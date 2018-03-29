import React from 'react';
import PropTypes from 'prop-types';

import ControlDropdown from './ControlDropdown';
import FormItem from './FormItem';

class FormDropdown extends React.Component {
    componentDidMount() {
        // ReduxForm doesn't have a prop for 'defaultValue'. You need to set it manually.
        const { defaultValue, options, input: { value, onChange } } = this.props;
        if (defaultValue) {
            if (!value) {
                onChange(defaultValue);
            }
        } else if (options.length > 0) {
            if (!value) {
                onChange(options[0].value);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { defaultValue, options, input: { onChange } } = this.props;

        // ReduxForm doesn't have a prop for 'defaultValue'. You need to set it manually.
        if (prevProps.options.length === 0 && options.length > 0) {
            if (defaultValue) {
                onChange(defaultValue);
            } else {
                onChange(options[0].value);
            }
        }
    }

    render() {
        const { label, defaultValue, isRequired, options, description, input: { name, onChange }, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));

        return (
            <FormItem name={name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
                <ControlDropdown {...this.props} name={name} onChange={onChange} defaultValue={defaultValue} options={options} />
            </FormItem>
        );
    }
}

FormDropdown.propTypes = {
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
    isRequired: PropTypes.bool,
    options: PropTypes.array,
    defaultValue: PropTypes.any,
}

export default FormDropdown;
