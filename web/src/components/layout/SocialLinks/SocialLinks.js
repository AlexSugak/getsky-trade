import React from 'react';
import styled from 'styled-components';
import Icon, { IconMap } from '../Icon/Icon';

const menuItems = [
    { icon: IconMap.Facebook, url: 'https://facebook.com/getskycoin' },
    { icon: IconMap.Twitter, url: 'https://twitter.com/getskycoin' },
    { icon: IconMap.Instagram, url: 'https://www.instagram.com/getskycoin/' },
];

const SocialMenu = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: row;
    padding: 10px 0;
`;

const SocialItem = styled.li`
    margin-left: 10px;
`;

export default () => (
    <SocialMenu className="social-menu">
        {menuItems.map((item, i) => (
            <SocialItem key={i}>
                <a href={item.url}>
                    <Icon name={item.icon} />
                </a>
            </SocialItem>
        ))}
    </SocialMenu>
);
