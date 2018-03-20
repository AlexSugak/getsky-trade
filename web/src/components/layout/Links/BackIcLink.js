import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon, { IconMap } from '../Icon'

const BackIcLink = ({ path, text }) => (
    <Link to={path}><Icon name={IconMap.AngleLeft} /> {text}</Link>
)


BackIcLink.propTypes = {
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

export default BackIcLink;
