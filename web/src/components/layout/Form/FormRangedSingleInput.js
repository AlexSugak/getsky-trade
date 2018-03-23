import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { B, Tip } from 'components/layout/Text';

import ControlInput from './ControlInput';
import FormItem from './FormItem';
import Button from './Button';

const RANGED_MODE = 'RANGED_MODE';
const SINGLE_MODE = 'SINGLE_MODE';

const fullWidth = { width: '100%' };

class RangedSingleInput extends React.Component {
    constructor(props) {
        super(props);

        this.setMode = this.setMode.bind(this);

        this.state = {
            mode: RANGED_MODE,
            value: {
                from: 0,
                to: 0,
            }
        }
    }

    componentDidMount() {
        const { input: { onChange } } = this.props;

        onChange(this.state.value);
    }

    setMode(mode) {
        this.setState({ ...this.state, mode });
    };

    render() {
        const { label, placeholder, isRequired, input, meta: { error, warning, touched } } = this.props;
        const showError = touched && (error || warning);

        return (
            <FormItem name={input.name} label={label} isRequired={isRequired} showError={showError} error={error}>
                <Flex mt={2}>
                    <Button type="button" text='Ranged amount' onClick={() => this.setMode(RANGED_MODE)} style={fullWidth} primary={this.state.mode === RANGED_MODE} />
                    <Button type="button" text='Single amount' onClick={() => this.setMode(SINGLE_MODE)} style={fullWidth} primary={this.state.mode === SINGLE_MODE} />
                </Flex>

                <Flex mt={2} alignItems='center' >
                    <ControlInput type={'number'} min={0} placeholder={placeholder} />
                    {this.state.mode === RANGED_MODE &&
                        <Box mx={2}>to</Box>
                    }
                    {this.state.mode === RANGED_MODE &&
                        <ControlInput type={'number'} min={0} placeholder={placeholder} />
                    }
                </Flex>
                <Box mt={2}>
                    <Tip>Please choose a <B>ranged</B> or <B>single</B> amount. Valid amounts are 1 to 999999.99</Tip>
                    <Tip>Example for ranged amounts: <B>60 to 70</B></Tip>
                    <Tip>Example for single amount: <B>50</B></Tip>
                </Box>
            </FormItem>
        );
    }
}

RangedSingleInput.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
}

export default RangedSingleInput;
