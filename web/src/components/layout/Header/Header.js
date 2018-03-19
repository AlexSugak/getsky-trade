import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from '../Container';
import Brand from '../Brand';
import Nav from '../Nav';
import SocialMenu from '../SocialLinks';
import { logout } from '../../routes/Login/actions'

const SubHeaderWrapper = styled.div`
    background: ${props => props.theme.colors.white};
`;

const HeaderWrapper = styled.div`
    background: ${props => props.theme.colors.black};
`;

const noAuthNavItems = [
    { url: '/', name: 'Home' },
    { url: '/search', name: 'Search' },
    { url: '/register', name: 'Register' },
    { url: '/login', name: 'Login' },
];

const authNavItems = [
    { url: '/', name: 'Home' },
    { url: '/search', name: 'Search' },
];

const Header = ({ authorized }) => (
    <header>
        <SubHeaderWrapper className="subheader">
            <Container alignItems="center" justifyContent="flex-end">
                <SocialMenu />
            </Container>
        </SubHeaderWrapper>
        <HeaderWrapper className="header">
            <Container alignItems="center" justifyContent="space-between" py={3}>
                <Brand />
                <Nav navItems={authorized ? authNavItems : noAuthNavItems} />
            </Container>
        </HeaderWrapper>
    </header>
);

Header.propTypes = {
    authorized: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ login }) => {
    return {
        authorized: login.authorized,
    }
};

export default connect(mapStateToProps, null)(Header);
