import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from 'components/layout/Checkbox';
import FormItem from 'components/layout/Form/FormItem';

class FormCheckboxGroup extends React.Component {
    constructor(props) {
        super(props);

        this.check = this.check.bind(this);
        this.state = {
            options: this.props.options.map(o => ({ ...o, checked: false })),
        }
    }

    check(value) {
        const { options } = this.props;

        this.setState({
            ...this.state,
            options: options.map(o => o.value === value ? { ...o, checked: !o.checked } : o)
        })
    }

    render() {
        const { label, isRequired, options, description, input: { name }, meta: { error, warning, touched } } = this.props;
        const showError = touched && (error || warning);

        return (
            <FormItem name={name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
                {options.length > 0 &&
                    options.map(o =>
                        <CheckBox checked={o.checked} onClick={() => this.check(o.value)} labelText={o.title} />
                    )
                }
            </FormItem>
        );
    }
}

FormCheckboxGroup.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
    })),
};

FormCheckboxGroup.defaultProps = {
    options: [],
};

export default FormCheckboxGroup;
