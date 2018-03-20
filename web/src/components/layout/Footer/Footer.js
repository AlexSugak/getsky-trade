import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Box } from 'grid-styled';
import Container from '../Container';
import Promo from '../Promo';
import Brand from '../Brand';
import SocialMenu from '../SocialLinks';

const infoLinks = [
    { name: 'Home', url: '/' },
    { name: 'Search adverts', url: '/search' },
    { name: 'Why Skycoin?', url: '/' },
    { name: 'FAQs', url: '/' },
    { name: 'Contact', url: '/' },
];
const userLinks = [
    { name: 'Register', url: '/' },
    { name: 'Log in', url: '/' },
    { name: 'Privacy', url: '/' },
    { name: 'Terms', url: '/' },
];

const getSkyLink = 'https://www.getsky.org/';
const skycoinLink = 'http://www.skycoin.org/';

const Subfooter = styled.div`
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
    
    .descr {
        margin: 0;
        max-width: 200px;
        font-size: 16px;
        line-height: 1.4;
    }
    
    a {
        display: block;
        font-size: 17px;
        line-height: 1.4;
        color: ${props => props.theme.colors.white};
    }
`;

const Footer = styled.footer`
    font-size: 17px;
    
    a {
        font-family: ${props => props.theme.fontBold};        
    }
`;

export default () => (
    <div>
        <Promo />
        <Subfooter className="subfooter">
            <Container justifyContent="space-between" py={4}>
                <Box w={1 / 2}>
                    <Brand />
                    <p className="descr">our aim is to spread the news of skycoin far and wide for all of the world to hear. Have you heard yet? Skycoin is the new Benjamin</p>
                </Box>
                <Box w={1 / 4}>
                    {infoLinks.map((item, i) => (
                        <Link to={item.url} key={i}>{item.name}</Link>
                    ))}
                </Box>
                <Box w={1 / 4}>
                    {userLinks.map((item, i) => (
                        <Link to={item.url} key={i}>{item.name}</Link>
                    ))}
                </Box>
            </Container>
        </Subfooter>
        <Footer className="footer">
            <Container alignItems="center" justifyContent="space-between">
                <p><a href={getSkyLink}>getSky</a> | a community built on <a href={skycoinLink}>Skycoin</a></p>
                <SocialMenu />
            </Container>
        </Footer>
    </div>
);
