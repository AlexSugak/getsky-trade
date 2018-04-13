import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grid-styled';

import Icon, { IconMap } from 'components/layout/Icon';
import { Span } from 'components/layout/Text';
import RedCircle from './RedCircle';

const NewMessageContainer = styled(({ hasNewMessages, ...props }) => <Box {...props} />) `
    Span {
        padding-top: 1px;
        margin-left: 10px;
    }
`;

const getLabel = (newMessages, totalMessages) => {
    if (newMessages && newMessages > 0) {
        return `${newMessages} new / ${totalMessages}`;
    }

    return `${totalMessages}`
};

const NewMessageCount = ({ newMessages, totalMessages }) => (
    <Box>
        <Icon name={IconMap.Envelope} />
        <RedCircle />
        <Box>{getLabel(newMessages, totalMessages)}</Box>
    </Box>
);

NewMessageCount.propTypes = {
    newMessages: PropTypes.number,
    totalMessages: PropTypes.number.isRequired,
};

export default NewMessageCount;
