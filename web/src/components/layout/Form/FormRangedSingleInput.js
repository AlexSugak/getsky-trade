import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from '../Container';
import ControlInput from './ControlInput';
import Wrapper from './ControlWrapper';
import FormLabel from './FormLabel';
import Button from './Button';
import InvertedButton from './InvertedButton';
import FormInput from './FormInput';
import ErrorMessage from './ErrorMessage';
import { B } from '../Text';
import { getBorderColor } from './helper';

const RANGED_MODE = 'RANGED_MODE';
const SINGLE_MODE = 'SINGLE_MODE';

class RangedSingleInput extends React.Component {
    state = {
        mode: RANGED_MODE,
        value: {
            from: 0,
            to: 0,
        }
    }

    setMode = mode => this.setState({ ...this.state, mode })

    render = () => {
        return (
            <Wrapper>
                <FormLabel>What is the amount of cash you will pay in USD?</FormLabel>
                <Button type="button" text='Ranged amount' onClick={() => this.setMode(RANGED_MODE)} />
                <InvertedButton type="button" text='Single amount' onClick={() => this.setMode(SINGLE_MODE)} />
                <Container>
                    <ControlInput placeholder="USD" />
                    {this.state.mode === RANGED_MODE && <div>
                        <span>to</span>
                        <ControlInput placeholder="USD" />
                    </div>}
                </Container>
                <FormLabel>Please choose a <B>ranged</B> or <B>single</B> amount. Valid amounts are 1 to 999999.99</FormLabel>
                <FormLabel>Example for ranged amounts: <B>60 to 70</B></FormLabel>
                <FormLabel>Example for single amount: <B>50</B></FormLabel>
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
