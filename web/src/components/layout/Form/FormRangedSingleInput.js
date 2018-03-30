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
        this.onChangeFrom = this.onChangeFrom.bind(this);
        this.onChangeTo = this.onChangeTo.bind(this);
        this.onChangeSingle = this.onChangeSingle.bind(this);

        this.state = {
            mode: RANGED_MODE,
            from: '',
            to: '',
            single: '',
        }
    };

    componentDidMount() {
        const { value } = this.props.input;

        if (value !== '') {
            if (value.from && value.to) {
                this.setState({ ...this.state, mode: RANGED_MODE, from: value.from, to: value.to });
            } else if (value.from) {
                this.setState({ ...this.state, mode: SINGLE_MODE, single: value.from });
            }
        }
    }

    setMode(mode) {
        const { input: { onChange } } = this.props;

        if (mode === SINGLE_MODE) {
            onChange({ to: null, from: this.state.single });
        } else {
            onChange({ to: this.state.to, from: this.state.from });
        }

        this.setState({ ...this.state, mode });
    };

    onChangeFrom(e) {
        const { input: { onChange, value } } = this.props;

        const from = e.target.value !== '' ? parseFloat(e.target.value) : '';
        this.setState({ ...this.state, from });
        onChange({ from, to: value.to || '' });
    };

    onChangeTo(e) {
        const { input: { onChange, value } } = this.props;

        const to = e.target.value !== '' ? parseFloat(e.target.value) : '';
        this.setState({ ...this.state, to });
        onChange({ from: value.from || '', to });
    };

    onChangeSingle(e) {
        const { input: { onChange } } = this.props;

        const single = e.target.value !== '' ? parseFloat(e.target.value) : '';
        this.setState({ ...this.state, single });
        onChange({ from: single });
    };

    render() {
        const { label, placeholder, isRequired, min, max, input, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));


        return (
            <FormItem name={input.name} label={label} isRequired={isRequired} showError={showError} error={error}>
                <Flex mt={2}>
                    <Button type="button" text='Ranged amount' onClick={() => this.setMode(RANGED_MODE)} style={fullWidth} primary={this.state.mode === RANGED_MODE} />
                    <Button type="button" text='Single amount' onClick={() => this.setMode(SINGLE_MODE)} style={fullWidth} primary={this.state.mode === SINGLE_MODE} />
                </Flex>
                {this.state.mode === RANGED_MODE &&
                    <Flex mt={2} alignItems='center' >
                        <ControlInput type="number" min={min} max={max} placeholder={placeholder} error={showError} onChange={this.onChangeFrom} value={this.state.from} />
                        <Box mx={2}>to</Box>
                        <ControlInput type="number" min={min} max={max} placeholder={placeholder} error={showError} onChange={this.onChangeTo} value={this.state.to} />
                    </Flex>
                }
                {this.state.mode === SINGLE_MODE &&
                    <Flex mt={2} alignItems='center' >
                        <ControlInput type="number" min={min} max={max} placeholder={placeholder} error={showError} onChange={this.onChangeSingle} value={this.state.single} />
                    </Flex>
                }
                <Box mt={2}>
                    <Tip>Please choose a <B>ranged</B> or <B>single</B> amount. Valid amounts are {min} to {max}</Tip>
                    <Tip>Example for ranged amounts: <B>60 to 70</B></Tip>
                    <Tip>Example for single amount: <B>50</B></Tip>
                </Box>
            </FormItem>
        );
    };
};

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
    label: PropTypes.string,
    isRequired: PropTypes.bool,
    options: PropTypes.array,
    defaultValue: PropTypes.any,
    min: PropTypes.number,
    max: PropTypes.number,
};

export default RangedSingleInput;
