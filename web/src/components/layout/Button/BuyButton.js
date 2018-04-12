import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'

import Button from './PrimaryButton';

const BuyButton = ({ push, text, className, primary }) => (
    <Button
        text={text}
        className={className}
        onClick={() => push('postings/buy')}
        primary={primary}
    />
);

BuyButton.defaultProps = {
    text: 'Post a buyer advert',
};

BuyButton.propTypes = {
    push: PropTypes.func.isRequired,
    text: PropTypes.string,
    className: PropTypes.string,
    primary: PropTypes.bool,
};

export default connect(null, { push })(BuyButton);
