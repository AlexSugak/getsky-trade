import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

import Btn from './PrimaryButton';

const BuyButton = ({ push, text, className }) => (
    <Btn
        text={text}
        className={className}
        onClick={() => push('postings/buy')}
    />
);

BuyButton.defaultProps = {
    text: 'Post a buyer advert',
};

BuyButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
    className: PropTypes.string,
};

export default connect(null, { push })(BuyButton);
