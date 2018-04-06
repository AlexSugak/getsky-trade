import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { Button } from 'components/layout/Button';
import { ConfirmModal } from 'components/layout/Modal';

const style = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const Footer = ({ onConfirm, onClose }) => (
    <Flex justifyContent={'flex-end'}>
        <Box mr={2}>
            <Button text={'Confirm'} onClick={onConfirm} primary />
        </Box>
        <Button text={'Close'} onClick={onClose} />
    </Flex>
)

const ExtendConfirm = ({ isOpen, onConfirm, onClose }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            style={style}
            footer={<Footer onConfirm={onConfirm} onClose={onClose} />}>
            <Box>
                hello world
            </Box>
        </ConfirmModal>
    );
};

ExtendConfirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ExtendConfirm;
