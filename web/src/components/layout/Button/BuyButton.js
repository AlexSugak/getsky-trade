import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'
import Btn from './Button';

const Button = styled(Btn) `
    color: ${props => props.theme.colors.buyGreen};
`
const BuyButton = ({ push }) => {
    return <Button text={'BuyButton'} onClick={() => push('postings/buy')} primary />
};

BuyButton.propTypes = {
    push: PropTypes.func,
};

export default connect(null, { push })(BuyButton);
