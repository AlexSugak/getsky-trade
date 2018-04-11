import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

const Container = styled(Flex)`
    width: ${props => props.theme.container.width};
    max-width: ${props => props.theme.container.maxWidth};
`;

Container.defaultProps = {
    mx: 'auto',
};

export default (props) => (
    <Container className="container" {...props}>
        {props.children}
    </Container>
);
