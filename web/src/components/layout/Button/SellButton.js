import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { push } from 'react-router-redux'

import Button from './PrimaryButton';

const Btn = styled(Button)`
    font-family: ${props => props.theme.fontLight };
`;

const SellButton = ({ push, text, className }) => (
    <Btn
        text={text}
        className={className}
        onClick={() => push('postings/sell')}
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
