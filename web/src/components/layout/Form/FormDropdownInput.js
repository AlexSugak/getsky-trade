import React from 'react';
import { Flex, Box } from 'grid-styled';
import PropTypes from 'prop-types';

import ControlDropdown from './ControlDropdown';
import ControlInput from './ControlInput';
import FormItem from './FormItem';

const inputStyle = { borderRight: 0 };

class FormDropdownInput extends React.Component {
    constructor(props) {
        super(props);

        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeDropdownValue = this.onChangeDropdownValue.bind(this);

        this.state = {
            value: {
                data: '',
                prefix: '',
            }
        }
    }

    componentDidMount() {
        const { defaultValue, input: { onChange } } = this.props;
        this.setState({ ...this.state, value: defaultValue });
        onChange(defaultValue);
    }

    onChangeText(e) {
        const value = { ...this.state.value, data: e.target.value };
        this.setState({ ...this.state, value });
        this.props.input.onChange(value);
    }

    onChangeDropdownValue(e) {
        const value = { ...this.state.value, prefix: e.target.value };

        this.setState({ ...this.state, value });
        this.props.input.onChange(value);
    }

    render() {
        const { label, type, min, max, description, isRequired, options, input: { name }, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));

        return (
            <FormItem name={name} label={label} isRequired={isRequired} description={description} showError={showError} error={error}>
                <Flex>
                    <Box width={3 / 4}>
                        <ControlInput name={`${name}_input_text`} type={type} min={min} max={max} placeholder={'Distance'} onChange={this.onChangeText} style={inputStyle} error={showError} />
                    </Box>
                    <Box width={1 / 4}>
                        <ControlDropdown name={`${name}_input_options`} options={options} onChange={this.onChangeDropdownValue} error={showError} />
                    </Box>
                </Flex>
            </FormItem>
        );
    }
}

FormDropdownInput.propTypes = {
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
    description: PropTypes.string,
    isRequired: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
    })),
    min: PropTypes.number,
    max: PropTypes.number,
    type: PropTypes.string,
};

export default FormDropdownInput;
