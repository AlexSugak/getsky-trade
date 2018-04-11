import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Container from 'components/layout/Container';
import Brand from 'components/layout/Brand';
import { Link } from 'components/layout/Links';
import SocialMenu from '../SocialLinks';

const Background = styled(Box) `
    background: ${props => `linear-gradient(${props.theme.colors.darkBlue}, ${props.theme.colors.black})`};
    margin-top: -200px;
    padding-top: 230px;
`

const LinksContainer = styled(Container) `
    border-bottom: 1px solid #979797;
    padding-bottom: 61px;
`;

export default () => (
    <Background>
        <LinksContainer justifyContent={'space-between'}>
            <Link path={''} text={'Home'} />
            <Link path={''} text={'Why Scycoin'} />
            <Link path={''} text={'Search'} />
            <Link path={''} text={'FAQ'} />
            <Link path={''} text={'Contact'} />
            <Link path={''} text={'Privacy'} />
            <Link path={''} text={'Terms'} />
        </LinksContainer>
        <Flex justifyContent={'center'} my={'76px'}>
            <Brand />
        </Flex>
    </Background>
);
