import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'grid-styled';

import Wrapper from './ControlWrapper';

import FormLabel from './FormLabel';
import { Tip } from '../Text';
import TextArea from '../TextArea';

const textAreaStyles = { height: 100 };

const FormTextArea = ({ label, tip, placeholder }) => (
    <Wrapper>
        <FormLabel>{label}</FormLabel>
        <Flex my={2} >
            <TextArea style={textAreaStyles} placeholder={placeholder} />
        </Flex>
        <Tip>{tip}</Tip>
    </Wrapper>
);

FormTextArea.propTypes = {
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
        warning: PropTypes.string,
    }).isRequired,
    label: PropTypes.string,
    tip: PropTypes.string,
    placeholder: PropTypes.string,
}

export default FormTextArea;
