import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
import RedCircle from './RedCircle';

const NewMessageCountContainer = styled(Box) `
    color: ${props => props.theme.colors.grayBlue};
    font-size: 12px;
    line-height: 13px;
    text-align: center;
`;

const CircleContainer = styled.div`
    position: relative;
    top: -1px;
    right: 5px;
`;

const NewMessagesContainer = styled.div`
    color: ${props => props.theme.colors.red};
    margin-right: 3px;
`;

const NewMessageCount = ({ newMessages, totalMessages }) => (
    <NewMessageCountContainer justifyContent={'center'}>
        <Flex ml={'10px'}>
            <Icon name={IconMap.Envelope} />
            {newMessages > 0 &&
                <CircleContainer>
                    <RedCircle />
                </CircleContainer>
            }
        </Flex>
        <Flex justifyContent={'center'} alignItems={'center'}>
            {newMessages > 0 &&
                <NewMessagesContainer>
                    {newMessages}
                </NewMessagesContainer>
            }
            {newMessages > 0 ? `/ ${totalMessages}` : totalMessages}
        </Flex>
    </NewMessageCountContainer>
);

NewMessageCount.propTypes = {
    newMessages: PropTypes.number,
    totalMessages: PropTypes.number.isRequired,
};

export default NewMessageCount;
