import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

const Container = styled(Flex)`
    width: 90%;
    max-width: 1280px;
`;

Container.defaultProps = {
    mx: 'auto',
};

export default (props) => (
    <Container className="container" {...props}>
        {props.children}
    </Container>
);
