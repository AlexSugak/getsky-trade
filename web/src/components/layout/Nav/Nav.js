import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.ul`
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const NavItem = styled.li`
    margin: 0 15px;
    font-size: ${props => props.theme.fontSizes[1]}px;
`;

const NavLink = styled(Link) `
    color: ${ props => props.theme.colors.white};
    text-decoration: none;

    &:hover {
        opacity: 0.8;
    }
`;

const BorderNavLink = styled(Link) `
    color: ${ props => props.theme.colors.white};
    text-decoration: none;
    border: 1px solid ${ props => props.theme.colors.white};
    padding: 10px 15px;

    &:hover {
        opacity: 0.8;
    }
`;

const NavItems = ({ navItems }) => (
    <Nav>
        {navItems.map((item, i) => (
            <NavItem key={i}>
                {item.border
                    ? <BorderNavLink to={item.url}>{item.name}</BorderNavLink>
                    : <NavLink to={item.url}>{item.name}</NavLink>
                }
            </NavItem>
        ))}
    </Nav>
);

NavItems.propTypes = {
    navItems: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        border: PropTypes.bool,
    })).isRequired,
}

export default NavItems;
