import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Icon, { IconMap } from 'components/layout/Icon';
import Expander from 'components/layout/Expander';
import theme from 'components/theme';

const UserMenuContainer = styled.div`
`;

const UserName = styled.span`
    margin: 0 3px;
`;

const UserMenu = styled.ul`
    position: absolute;
    list-style: none;
    background-color: ${theme.colors.black};
`;

const UserMenuItem = styled.li`
    margin-bottom: -1px;
    & > * {
        padding: 10px 50px;
        display: block;
    }
    border-top: 1px solid ${theme.colors.lightGray};
    border-bottom: 1px solid ${theme.colors.lightGray};
    color: ${theme.colors.white};


    &:hover {
        opacity: 0.5;
        cursor: pointer;
        background-color: ${theme.colors.white};

        font-weight: bold;
        color: ${theme.colors.black};
    }

    &:last-child {
        border-top: 0;
        border-bottom: 0;
    }
`;

const NavLink = styled(Link) `
    color: ${theme.colors.white};

    ${UserMenuItem}:hover & {
        font-weight: bold;
        color: ${theme.colors.black};
    }
`;

export default ({ userInfo, logout }) => (
    <UserMenuContainer>
        <Expander label={
            <UserName>
                <Icon name={IconMap.User} /> {userInfo && userInfo.username}
            </UserName>
        }>
            <UserMenu>
                <UserMenuItem>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                </UserMenuItem>
                <UserMenuItem>
                    <NavLink to="/user-settings">Settings</NavLink>
                </UserMenuItem>
                <UserMenuItem onClick={logout}>
                    <span>Log out</span>
                </UserMenuItem>
            </UserMenu>
        </Expander>
    </UserMenuContainer>
);
