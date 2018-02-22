import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import logo from './getSky-Logo.png';

const Logo = styled.img.attrs({
    src: logo
})`
    display: block;
    height: 96px;
    width: auto;
`;

const Brand = styled(Link)`
    display: block;    
`;

export default () => (
    <Brand to="/"><Logo className="logo" /></Brand>
);
