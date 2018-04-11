import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import { Link } from 'react-router-dom';

import Expander from 'components/layout/Expander';
import theme from 'components/theme';

import icDashboard from './icons/icDashboard.svg';
import icLogout from './icons/icLogout.svg';
import icSettings from './icons/icSettings.svg';

const Ic = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 14px;
`

const UserName = styled.span`
    color: ${theme.colors.white};
    font-size: ${theme.fontSizes[0]}px;
`;

const UserMenu = styled(Box) `
    position: absolute;
    z-index: 1000;
    margin-top: 11px;
    padding: 8px 0px;
    background-color: ${theme.colors.darkBlue};
`;

const UserMenuItem = styled(Flex) `
    padding: 8px 23px;
    font-size: ${theme.fontSizes[1]}px;
    color: ${theme.colors.white};

    &:hover {
        cursor: pointer;
        color: ${theme.colors.blue};
    }
`;

const NavLink = styled(Link) `
    width: 100%;
    color: ${theme.colors.white};
    &:hover {
        color: ${theme.colors.blue};
    }
`;

const UserSubmenu = ({ userInfo, logout }) => (
    <Expander label={
        <UserName>
            {userInfo && userInfo.username}
        </UserName>
    }>
        <UserMenu>
            <UserMenuItem alignItems={'center'}>
                <Ic src={icDashboard} />
                <NavLink to="/dashboard">Dashboard</NavLink>
            </UserMenuItem>
            <UserMenuItem alignItems={'center'}>
                <Ic src={icSettings} />
                <NavLink to="/user-settings">Settings</NavLink>
            </UserMenuItem>
            <UserMenuItem onClick={logout} alignItems={'center'}>
                <Ic src={icLogout} />
                <span>Log out</span>
            </UserMenuItem>
        </UserMenu>
    </Expander>
);

UserSubmenu.propTypes = {
    userInfo: PropTypes.object,
    logout: PropTypes.func,
};

export default UserSubmenu;
