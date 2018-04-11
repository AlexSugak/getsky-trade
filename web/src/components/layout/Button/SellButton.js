import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'
import Btn from './Button';

const Button = styled(Btn) `
    color: ${props => props.theme.colors.sellBlue};
`
const SellButton = ({ push, text }) => {
    return <Button text={text} onClick={() => push('postings/sell')} primary />
};

SellButton.defaultProps = {
    text: 'Post a seller advert',
};

SellButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
};

export default connect(null, { push })(SellButton);
