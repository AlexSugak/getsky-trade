import React from 'react';
import { Box } from 'grid-styled'

import { Warning } from 'components/layout/Alerts';

const SkyAmountWarning = () => (
    <Box mb={3}>
        <Warning>
            The amount of SKY corresponding to the amount of USD you enter will be shown on the next page. You can come back to this page to make adjustments if required.
        </Warning>
    </Box>
)

export default SkyAmountWarning;
