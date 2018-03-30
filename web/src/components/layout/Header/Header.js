import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from '../Container';
import Brand from '../Brand';
import Nav from '../Nav';
import SocialMenu from '../SocialLinks';
import UserSubmenu from '../UserSubmenu';
import SkyPrice from '../SkyPrice';

import { logout } from 'components/routes/Login/actions';

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

const Header = ({ authorized, userInfo, skyPrices, currencies, logout }) => (
    <header>
        <SubHeaderWrapper className="subheader">
            <Container alignItems="center" justifyContent={authorized ? 'space-between' : 'flex-end'}>
                {authorized && <UserSubmenu userInfo={userInfo} logout={logout} />}
                <SkyPrice currencies={currencies} skyPrices={skyPrices} defaultCurrency={userInfo && userInfo.currency} />
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

const mapStateToProps = ({ login, app, }) => {
    return {
        authorized: login.authorized,
        userInfo: app.userInfo,
        skyPrices: app.skyPrices,
        currencies: app.currencies,
    }
};

export default connect(mapStateToProps, { logout })(Header);
