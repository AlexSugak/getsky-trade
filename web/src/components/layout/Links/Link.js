import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const L = styled(Link) `
    color: ${props => props.theme.colors.blue};
    font-family: ${props => props.theme.fontSizes[1]}px;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
`;

const LinkControl = ({ path, text }) => (
    <L to={path}>{text}</L>
)

LinkControl.propTypes = {
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

export default LinkControl;
