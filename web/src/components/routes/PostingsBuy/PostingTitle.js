import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default () => (
    <div>
        <h2>Post an advert to buy Monero</h2>
        <h3>If you can't <Link to="/search"> find someone selling Monero</Link> who matches your requirements, you can post a free buy advert to let others in your area know you're looking to buy.</h3>
    </div>
);

