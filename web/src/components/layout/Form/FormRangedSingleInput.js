import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import ControlInput from './ControlInput';
import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import Button from './Button';
import { B, Tip } from '../Text';

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

    setMode(mode) {
        this.setState({ ...this.state, mode })
    };

    render() {
        return (
            <Wrapper>
                <FormLabel>What is the amount of cash you will pay in USD?</FormLabel>
                <Flex mt={2}>
                    <Button type="button" text='Ranged amount' onClick={() => this.setMode(RANGED_MODE)} style={fullWidth} primary={this.state.mode === RANGED_MODE} />
                    <Button type="button" text='Single amount' onClick={() => this.setMode(SINGLE_MODE)} style={fullWidth} primary={this.state.mode === SINGLE_MODE} />
                </Flex>

                <Flex mt={2} alignItems='center' >
                    <ControlInput placeholder="USD" />
                    {this.state.mode === RANGED_MODE &&
                        <Box mx={2}>to</Box>
                    }
                    {this.state.mode === RANGED_MODE &&
                        <ControlInput placeholder="USD" />
                    }
                </Flex>
                <Box mt={2}>
                    <Tip>Please choose a <B>ranged</B> or <B>single</B> amount. Valid amounts are 1 to 999999.99</Tip>
                    <Tip>Example for ranged amounts: <B>60 to 70</B></Tip>
                    <Tip>Example for single amount: <B>50</B></Tip>
                </Box>
            </Wrapper>
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
