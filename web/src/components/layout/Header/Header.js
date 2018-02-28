import React from 'react';
import styled from 'styled-components';
import Container from '../Container';
import Brand from '../Brand';
import Nav from '../Nav';
import SocialMenu from '../SocialLinks';

const SubHeaderWrapper = styled.div`
    background: ${props => props.theme.colors.white};
`;

const HeaderWrapper = styled.div`
    background: ${props => props.theme.colors.black};
`;

export default () => (
    <header>
        <SubHeaderWrapper className="subheader">
            <Container alignItems="center" justifyContent="flex-end">
                <SocialMenu />
            </Container>
        </SubHeaderWrapper>
        <HeaderWrapper className="header">
            <Container alignItems="center" justifyContent="space-between" py={3}>
                <Brand />
                <Nav />
            </Container>
        </HeaderWrapper>
    </header>
);
