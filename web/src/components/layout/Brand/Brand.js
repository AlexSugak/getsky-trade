import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from './logo_getsky.svg';

const Brand = styled(Link) `
    display: block;
`;

export default () => (
    <Brand to="/">
        <img src={logo} />>
    </Brand>
);
