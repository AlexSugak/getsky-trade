import React from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook';
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter';
import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram';

import faAngleLeft from '@fortawesome/fontawesome-free-solid/faAngleLeft'
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';

import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';

export const IconMap = {
    Facebook: faFacebook,
    Twitter: faTwitter,
    Instagram: faInstagram,
    AngleLeft: faAngleLeft,
    AngleRight: faAngleRight,
    AngleUp: faAngleUp,
    AngleDown: faAngleDown,

    ExclamationCircle: faExclamationCircle,
    CheckCircle: faCheckCircle,
}

const Icon = ({ name }) => (
    <FontAwesomeIcon icon={name} />
)

Icon.propTypes = {
    name: PropTypes.object.isRequired,
};

Icon.defaultProps = {
    name: IconMap.Facebook,
};

export default Icon;
