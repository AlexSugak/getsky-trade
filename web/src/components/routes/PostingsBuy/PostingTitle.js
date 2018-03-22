import React from 'react';
import { Box } from 'grid-styled';
import { Link } from 'react-router-dom';

import { H1, P } from '../../layout/Text';

export default () => (
    <Box>
        <H1>Post an advert to buy Skycoin</H1>
        <P>If you can't <Link to="/search"> find someone selling Skycoin</Link> who matches your requirements, you can post a free buy advert to let others in your area know you're looking to buy.</P>
    </Box>
);

