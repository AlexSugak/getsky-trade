import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { B, Tip, Span } from 'components/layout/Text';
import { ControlInput, FormItem, Button } from 'components/layout/Form';
import TipToggles from 'components/layout/TipToggles';

const LEFT_ACTIVE = 'LEFT_ACTIVE';
const RIGHT_ACTIVE = 'RIGHT_ACTIVE';

const fullWidth = { width: '100%' };

const PercentageAdjustmentTip = () => (
    <Box>
        <Tip><B>A percentage (up to two decimal places) you want applied to the SKY exchange rate price.</B></Tip>
        <Tip>Example: 10</Tip>
        <Tip>At the time of the trade, if the SKY exchange rate price is <B>100 USD</B> and you choose <B>10</B> to indicate 10%, you will be selling your SKY for <B>110 USD</B> each.</Tip>
        <Box mt={2}>
            <TipToggles label={'Exchange rate examples'}>
                <Flex>
                    <Box width={1 / 4}><Tip>0% = 196.41 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>2% = 200.34 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>4% = 204.27 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>6% = 208.19 USD</Tip></Box>
                </Flex>
                <Flex mt={1}>
                    <Box width={1 / 4}><Tip>8% = 212.12 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>10% = 216.05 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>12% = 219.98 USD</Tip></Box>
                    <Box width={1 / 4}><Tip>14% = 223.91 USD</Tip></Box>
                </Flex>
            </TipToggles>
        </Box>
    </Box>
);

const FixedPriceTip = () => (
    <Box>
        <Tip>Up to two decimal places. The exchange rate <B>will not</B> alter this price.</Tip>
        <Tip>Example: 200</Tip>
        <Tip>This means you will sell your SKY at 200 USD each.</Tip>
    </Box>
);

const Label = () => (
    <Span>
        Price per coin (last price from <a href={'https://coinmarketcap.com/currencies/skycoin/'}>coinmarketcap.com</a> = 196.41 USD)
    </Span>
);

class FormCoinPriceInput extends React.Component {
    constructor(props) {
        super(props);
        this.setMode = this.setMode.bind(this);
        this.state = { mode: LEFT_ACTIVE }
    };

    setMode(mode) {
        this.setState({ ...this.state, mode });
    };

    render() {
        const { isRequired, input, meta: { error, warning, touched } } = this.props;
        const showError = !!(touched && (error || warning));

        return (
            <FormItem name={input.name} label={<Label />} isRequired={isRequired} showError={showError} error={error}>
                <Flex mt={2}>
                    <Button type="button" text='PERCENTAGE ADJUSTMENT' onClick={() => this.setMode(LEFT_ACTIVE)} style={fullWidth} primary={this.state.mode === LEFT_ACTIVE} />
                    <Button type="button" text='FIXED PRICE' onClick={() => this.setMode(RIGHT_ACTIVE)} style={fullWidth} primary={this.state.mode === RIGHT_ACTIVE} />
                </Flex>
                <Flex mt={2} alignItems='center' >
                    {this.state.mode === LEFT_ACTIVE &&
                        <ControlInput type="number" placeholder={'percentage adjustment, e.g. 5'} error={showError} />
                    }
                    {this.state.mode === RIGHT_ACTIVE &&
                        <ControlInput type="number" placeholder={'USD'} error={showError} />
                    }
                </Flex>
                <Box mt={2}>
                    {this.state.mode === LEFT_ACTIVE &&
                        <PercentageAdjustmentTip />
                    }
                    {this.state.mode === RIGHT_ACTIVE &&
                        <FixedPriceTip />
                    }
                </Box>
            </FormItem>
        );
    };
};

FormCoinPriceInput.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
};

export default FormCoinPriceInput;
