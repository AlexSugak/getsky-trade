import React from 'react';
import { Flex, Box } from 'grid-styled';

import ControlDropdown from './ControlDropdown';
import ControlInput from './ControlInput';
import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import ErrorMessage from './ErrorMessage';

const inputStyle = { borderRight: 0 };

export default class FormDropdownInput extends React.Component {
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
                <Flex>
                    <Box width={3 / 4}>
                        <ControlInput placeholder={'Distance'} onChange={this.onChangeText} style={inputStyle} />
                    </Box>
                    <Box width={1 / 4}>
                        <ControlDropdown options={options} onChange={this.onChangeDropdownValue} />
                    </Box>
                </Flex>
                {showError && <ErrorMessage>{error || warning}</ErrorMessage>}
            </Wrapper>
        );
    }
}
