import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const navItems = [
    { url: '/', name: 'Home' },
    { url: '/search', name: 'Search' },
];

const Nav = styled.ul`
     display: flex;
     flex-direction: row;
     margin: 0;
     padding: 0;
     list-style: none;
`;

const NavItem = styled.li`
    margin: 0 15px;
`;

const NavLink = styled(Link)`
    color: ${props => props.theme.colors.white};
    text-decoration: none;
    
    &:hover {
        opacity: 0.8;
    }
`;

export default () => (
    <Nav className="nav">
        {navItems.map((item, i) => (
            <NavItem key={i}>
                <NavLink to={item.url}>{item.name}</NavLink>
            </NavItem>
        ))}
    </Nav>
);
