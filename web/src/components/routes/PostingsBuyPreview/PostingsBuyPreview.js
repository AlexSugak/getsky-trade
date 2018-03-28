import React from 'react';
import { Box } from 'grid-styled';

import Container from 'components/layout/Container';
import { BackIcLink } from 'components/layout/Links';
import { H1, B } from 'components/layout/Text';
import { Warning } from 'components/layout/Alerts';

const ExchangeRateWarning = () => (
    <Box>
        <Warning>
            <B>
                The amount of SKY shown in the advert may change with the exchange rate of USD.
            </B>
            The actual amount of SKY will need to be determined between the seller and buyer.
        </Warning>
    </Box>
);

class PostingsBuyPreview extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(form) {
    }

    render() {
        return (
            <Container flex='1 0 auto' flexDirection='column' py={4}>
                <BackIcLink path='/postings/buy' text='Edit advert' />
                <H1>Advert preview</H1>
                <ExchangeRateWarning />
            </Container>
        )
    }
}

export default PostingsBuyPreview;
