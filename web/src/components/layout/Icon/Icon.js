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

import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';

import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';

import faUser from '@fortawesome/fontawesome-free-solid/faUserCircle';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';

export const IconMap = {
    Facebook: faFacebook,
    Twitter: faTwitter,
    Instagram: faInstagram,

    AngleLeft: faAngleLeft,
    AngleRight: faAngleRight,
    AngleUp: faAngleUp,
    AngleDown: faAngleDown,

    CaretUp: faCaretUp,
    CaretDown: faCaretDown,

    ExclamationCircle: faExclamationCircle,
    CheckCircle: faCheckCircle,

    User: faUser,
    Envelope: faEnvelope,

    Clock: faClock,
    Trash: faTrash,
}

const Icon = ({ name, color }) => (
    <FontAwesomeIcon icon={name} color={color} />
)

Icon.propTypes = {
    name: PropTypes.object.isRequired,
    color: PropTypes.string,
};

Icon.defaultProps = {
    color: 'black',
};

export default Icon;
