import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from 'components/layout/Checkbox';
import FormItem from 'components/layout/Form/FormItem';

const isChecked = (values, item) => values !== '' ? values.findIndex(v => item === v) !== -1 : false;

class FormCheckboxGroup extends React.Component {
    constructor(props) {
        super(props);
        this.check = this.check.bind(this);
    }

    check(item) {
        const { input: { onChange, value } } = this.props;

        if (value === '') {
            onChange([item])
        } else {
            const index = value.findIndex(v => item === v);
            const updatedValue = index === -1 ? [...value, item] : value.filter(v => v !== item)
            updatedValue.length === 0 ? onChange('') : onChange(updatedValue);
        }
    }

    render() {
        const { label, isRequired, options, description, input: { name, value }, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));

        return (
            <FormItem name={name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
                {options.length > 0 &&
                    options.map(o =>
                        <CheckBox key={`${name}_checkbox_${o.value}`} checked={isChecked(value, o.value)} onChange={() => this.check(o.value)} labelText={o.title} />
                    )
                }
            </FormItem>
        );
    }
}

FormCheckboxGroup.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
    })),
    label: PropTypes.string,
    description: PropTypes.string,
    isRequired: PropTypes.bool,
};

FormCheckboxGroup.defaultProps = {
    options: [],
};

export default FormCheckboxGroup;
