import React from 'react';
import PropTypes from 'prop-types';
import SVGImage from 'react-svg';

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
import faCaretLeft from '@fortawesome/fontawesome-free-solid/faCaretLeft';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';

import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';

import faUser from '@fortawesome/fontawesome-free-solid/faUserCircle';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';

import icDashboard from './svg/icDashboard.svg';
import icDelete from './svg/icDelete.svg';
import icEdit from './svg/icEdit.svg';
import icError from './svg/icError.svg';
import icExtend from './svg/icExtend.svg';
import icLogout from './svg/icLogout.svg';
import icMenu from './svg/icMenu.svg';
import icMessages from './svg/icMessages.svg';
import icOk from './svg/icOk.svg';
import icRequired from './svg/icRequired.svg';
import icRequiredCopy from './svg/icRequiredCopy.svg';
import icSettings from './svg/icSettings.svg';

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
    CaretLeft: faCaretLeft,
    CaretRight: faCaretRight,

    ExclamationCircle: faExclamationCircle,
    CheckCircle: faCheckCircle,

    User: faUser,

    Clock: faClock,

    Dashboard: icDashboard,
    Trash: icDelete,
    PencilSquare: icEdit,
    Error: icError,
    Extend: icExtend,
    Logout: icLogout,
    Menu: icMenu,
    Envelope: icMessages,
    Ok: icOk,
    Required: icRequired,
    RequiredCopy: icRequiredCopy,
    Settings: icSettings,
}

const Icon = ({ name, color, size }) => {
    return typeof name === 'string'
        ? <SVGImage path={name} style={{ height: size, width: size }} />
        : <FontAwesomeIcon icon={name} color={color} size={size} />;
};

Icon.propTypes = {
    name: PropTypes.object.isRequired,
    color: PropTypes.string,
};

Icon.defaultProps = {
    color: 'black',
};

export default Icon;
