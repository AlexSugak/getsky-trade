import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
import { Span } from 'components/layout/Text';

const NewMessageContainer = styled(({ hasNewMessages, ...props }) => <Flex {...props} />) `
    display: inline-flex;
    background: ${props => props.hasNewMessages ? props.theme.colors.warningLight : props.theme.colors.lightGray};

    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 5px;

    Span {
        padding-top: 1px;
        margin-left: 10px;
    }
`;

const getLabel = (newMessages, totalMessages) => {
    if (newMessages && newMessages > 0) {
        return `${newMessages} new / ${totalMessages}`;
    }

    return `${totalMessages} messages`
};

const NewMessageCount = ({ newMessages, totalMessages }) => (
    <NewMessageContainer alignItems={'center'} flexWrap={'wrap'} hasNewMessages={newMessages > 0}>
        <Icon name={IconMap.Envelope} />
        <Span>{getLabel(newMessages, totalMessages)}</Span>
    </NewMessageContainer>
);

NewMessageCount.propTypes = {
    newMessages: PropTypes.number,
    totalMessages: PropTypes.number.isRequired,
};

export default NewMessageCount;
