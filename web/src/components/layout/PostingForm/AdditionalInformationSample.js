import React from 'react';
import { Box } from 'grid-styled'

import { Warning } from 'components/layout/Alerts';

const AdditionalInformationSample = () => (
    <Box mb={3}>
        <Warning>
            <span>Additional information: This is for any additional description/terms about the trade. The information here will take precedence over the other fields.</span>
            <p> Useful information includes:</p>
            <ul>
                <li>places you can meet</li>
                <li>times you can meet</li>
                <li>any helpful information on your trade limits</li>
            </ul>
        </Warning>
    </Box>
)

export default AdditionalInformationSample;
