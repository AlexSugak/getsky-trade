import React from 'react';
import { Box } from 'grid-styled'

import { Warning } from 'components/layout/Alerts';
import { Span, P, Ul, Li } from 'components/layout/Text';

const AdditionalInformationSample = () => (
    <Box mb={3}>
        <Warning>
            <Span>Additional information: This is for any additional description/terms about the trade. The information here will take precedence over the other fields.</Span>
            <P> Useful information includes:</P>
            <Box ml={3}>
                <Ul>
                    <Li>places you can meet</Li>
                    <Li>times you can meet</Li>
                    <Li>any helpful information on your trade limits</Li>
                </Ul>
            </Box>
        </Warning>
    </Box>
)

export default AdditionalInformationSample;
