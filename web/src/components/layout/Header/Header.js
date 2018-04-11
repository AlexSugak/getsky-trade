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
    margin-top: 38px;
`;

const noAuthNavItems = [
    { url: '/', name: 'Home', border: false },
    { url: '/search', name: 'Search', border: false },
    { url: '/register', name: 'Sign Up', border: false },
    { url: '/login', name: 'Log In', border: true },
];

const authNavItems = [
    { url: '/', name: 'Home', border: false },
    { url: '/search', name: 'Search', border: false },
];

const Header = ({ authorized, userInfo, skyPrices, currencies, logout }) => (
    <header>
        <SubHeaderWrapper>
            <Container alignItems={'center'} justifyContent={'space-between'}>
                <SkyPrice skyPrices={skyPrices} />
                {authorized && <UserSubmenu userInfo={userInfo} logout={logout} />}
            </Container>
        </SubHeaderWrapper>
        <HeaderWrapper style={{ position: 'absolute', width: '100%' }}>
            <Container alignItems={'center'} justifyContent={'space-between'}>
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
