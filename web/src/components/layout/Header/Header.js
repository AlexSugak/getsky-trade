import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import Container from '../Container';
import Brand from '../Brand';
import Nav from '../Nav';
import UserSubmenu from '../UserSubmenu';
import SkyPrice from '../SkyPrice';

import { logout } from 'components/routes/Login/actions';

const SubHeaderWrapper = styled(Flex) `
    background: ${props => props.theme.colors.darkBlue};
    height: 38px;
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
        <SubHeaderWrapper>
            <Container alignItems={'center'} justifyContent={'space-between'}>
                <SkyPrice skyPrices={skyPrices} />
                {authorized && <UserSubmenu userInfo={userInfo} logout={logout} />}
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
