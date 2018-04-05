import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { B, Tip, Span } from 'components/layout/Text';
import { Button } from 'components/layout/Button';
import { ControlInput, FormItem } from 'components/layout/Form';
import TipToggles from 'components/layout/TipToggles';
import { round } from 'utils/';

const PERCENTAGE_ADJUSTMENT = 'PERCENTAGE_ADJUSTMENT';
const FIXED_PRICE = 'FIXED_PRICE';

const fullWidth = { width: '100%' };
const skyPriceWithPercents = (skyPrice, percent) => {
    const extra = skyPrice * percent;
    return round((parseFloat(skyPrice, 10) + extra), 2);
};

const PercentageAdjustmentTip = ({ skyPrice }) => (
    <Box>
        <Tip><B>A percentage (up to two decimal places) you want applied to the SKY exchange rate price.</B></Tip>
        <Tip>Example: 10</Tip>
        <Tip>At the time of the trade, if the SKY exchange rate price is <B>100 USD</B> and you choose <B>10</B> to indicate 10%, you will be selling your SKY for <B>110 USD</B> each.</Tip>
        <Box mt={2}>
            <TipToggles label={'Exchange rate examples'}>
                <Flex>
                    <Box width={1 / 4}><Tip>0% = {round(skyPrice, 2)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>2% = {skyPriceWithPercents(skyPrice, 0.02)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>4% = {skyPriceWithPercents(skyPrice, 0.04)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>6% = {skyPriceWithPercents(skyPrice, 0.06)} USD</Tip></Box>
                </Flex>
                <Flex mt={1}>
                    <Box width={1 / 4}><Tip>8% = {skyPriceWithPercents(skyPrice, 0.08)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>10% = {skyPriceWithPercents(skyPrice, 0.1)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>12% = {skyPriceWithPercents(skyPrice, 0.12)} USD</Tip></Box>
                    <Box width={1 / 4}><Tip>14% = {skyPriceWithPercents(skyPrice, 0.14)} USD</Tip></Box>
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

const Label = ({ skyPrice }) => (
    <Span>
        Price per coin (last price from <a href={'https://coinmarketcap.com/currencies/skycoin/'}>coinmarketcap.com</a> = {round(skyPrice, 2)} USD)
    </Span>
);

class FormCoinPriceInput extends React.Component {
    constructor(props) {
        super(props);
        this.setMode = this.setMode.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            mode: PERCENTAGE_ADJUSTMENT,
            fixedPrice: '',
            percentageAdjustment: '',
        };
    };

    componentDidMount() {
        const { value } = this.props.input;

        if (value !== '') {
            if (value.type === PERCENTAGE_ADJUSTMENT) {
                this.setState({ ...this.setState, mode: PERCENTAGE_ADJUSTMENT, percentageAdjustment: value.value })
            } else {
                this.setState({ ...this.setState, mode: FIXED_PRICE, fixedPrice: value.value })
            }
        }
    }

    setMode(mode) {
        const { input: { onChange } } = this.props;
        if (mode === PERCENTAGE_ADJUSTMENT) {
            const value = this.state.percentageAdjustment;
            onChange(value ? { type: mode, value } : null);
        } else {
            const value = this.state.fixedPrice;
            onChange(value ? { type: mode, value } : null);
        }

        this.setState({ ...this.state, mode });
    };

    onChange(e) {
        const { input: { onChange } } = this.props;
        const val = e.target.value;
        const value = isNaN(parseInt(val, 10)) ? '' : parseInt(val, 10);

        if (val === '') {
            onChange(null);
        }
        else {
            onChange({ value, type: this.state.mode });
        }

        if (this.state.mode === PERCENTAGE_ADJUSTMENT) {
            this.setState({ ...this.state, percentageAdjustment: value });
        } else if (this.state.mode === FIXED_PRICE) {
            this.setState({ ...this.state, fixedPrice: value });
        }
    }

    render() {
        const { isRequired, input, meta: { error, warning, touched }, skyPrices } = this.props;
        const { fixedPrice, percentageAdjustment } = this.state;
        const showError = !!(touched && (error || warning));

        const skyPrice = skyPrices['USD'];

        return (
            <FormItem name={input.name} label={<Label skyPrice={skyPrice} />} isRequired={isRequired} showError={showError} error={error}>
                <Flex mt={2}>
                    <Button type="button" text='PERCENTAGE ADJUSTMENT' onClick={() => this.setMode(PERCENTAGE_ADJUSTMENT)} style={fullWidth} primary={this.state.mode === PERCENTAGE_ADJUSTMENT} />
                    <Button type="button" text='FIXED PRICE' onClick={() => this.setMode(FIXED_PRICE)} style={fullWidth} primary={this.state.mode === FIXED_PRICE} />
                </Flex>
                <Flex mt={2} alignItems='center' >
                    {this.state.mode === PERCENTAGE_ADJUSTMENT &&
                        <ControlInput type="number" placeholder={'percentage adjustment, e.g. 5'} error={showError} value={percentageAdjustment} onChange={this.onChange} />
                    }
                    {this.state.mode === FIXED_PRICE &&
                        <ControlInput type="number" placeholder={'USD'} error={showError} value={fixedPrice} onChange={this.onChange} />
                    }
                </Flex>
                <Box mt={2}>
                    {this.state.mode === PERCENTAGE_ADJUSTMENT &&
                        <PercentageAdjustmentTip skyPrice={skyPrice} />
                    }
                    {this.state.mode === FIXED_PRICE &&
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
