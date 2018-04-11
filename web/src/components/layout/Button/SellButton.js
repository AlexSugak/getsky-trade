import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'

import Button from './PrimaryButton';

const Btn = styled(Button) `
    background: ${props => props.theme.colors.white};
    border-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.black};
    font-family: ${props => props.theme.fontBold};
`;

const SellButton = ({ push, text, className }) => (
    <Btn
        text={text}
        className={className}
        onClick={() => push('postings/sell')}
        primary
    />
);

SellButton.defaultProps = {
    text: 'Post a seller advert',
};

SellButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
    className: PropTypes.string,
};

export default connect(null, { push })(SellButton);
