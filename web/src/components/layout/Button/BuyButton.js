import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'
import Btn from './Button';

const Button = styled(Btn) `
    color: ${props => props.theme.colors.buyGreen};
`
const BuyButton = ({ push, text }) => {
    return <Button text={text} onClick={() => push('postings/buy')} primary />
};

BuyButton.defaultProps = {
    text: 'Post a buyer advert',
};

BuyButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
};

export default connect(null, { push })(BuyButton);
