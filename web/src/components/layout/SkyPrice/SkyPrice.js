import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import theme from 'components/theme';
import ControlDropdown from 'components/layout/Form/ControlDropdown';

import { round } from 'utils/';

const SkyPrice = styled.span`
    font-size: ${theme.fontSizes[0]}px;
`;

const CurrencySelectorContainer = styled.div`
    select {
        height: ${theme.spaces[4]}px;
        font-size: ${theme.fontSizes[0]}px;
        margin-right: ${theme.spaces[1]}px;
    }

    div::after {
        right: 5px;
    }

    margin-left: ${theme.spaces[1]}px;
`;

export default class extends React.Component {
    state = {
        selectedCurrency: 'USD',
    }
    selectCurrency = currency => {
        this.setState({ ...this.state, selectedCurrency: currency });
    }
    render() {
        const { skyPrices, currencies } = this.props;
        const { selectedCurrency } = this.state;

        return (
            <Flex justify="center" align="center">
                <SkyPrice>
                    Latest Skycoin (SKY) price {round(skyPrices[selectedCurrency], 3)} {selectedCurrency}
                </SkyPrice>
                <CurrencySelectorContainer>
                    <ControlDropdown
                        name="currencyDropdown"
                        options={currencies.map(c => ({ text: c, value: c }))}
                        onChange={e => this.selectCurrency(e.target.value)}
                        input={{ value: selectedCurrency }} />
                </CurrencySelectorContainer>
            </Flex>);
    }
}
