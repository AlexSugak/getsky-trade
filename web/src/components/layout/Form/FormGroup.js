import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grid-styled';

import { H2 } from '../Text'

const FormGroup = ({ label, children }) => (
    <Box py={1}>
        <H2>{label}</H2>
        {children}
    </Box>
);

FormGroup.propTypes = {
    label: PropTypes.string,
};

export default FormGroup;
