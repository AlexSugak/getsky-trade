import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'
import Btn from './Button';

const Button = styled(Btn) `
    color: ${props => props.theme.colors.sellBlue};
`
const SellButton = ({ push }) => {
    return <Button text={'Post a seller advert'} onClick={() => push('postings/sell')} primary />
};

SellButton.propTypes = {
    push: PropTypes.func,
};

export default connect(null, { push })(SellButton);
