import React from 'react';
import { Link } from 'react-router-dom';

import { H1 } from '../../layout/Text';

export default () => (
    <div>
        <H1>Post an advert to buy Skycoin</H1>
        <h3>If you can't <Link to="/search"> find someone selling Skycoin</Link> who matches your requirements, you can post a free buy advert to let others in your area know you're looking to buy.</h3>
    </div>
);

