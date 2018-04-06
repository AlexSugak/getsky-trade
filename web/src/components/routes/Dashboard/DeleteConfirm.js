import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';

import { Button } from 'components/layout/Button';
import { ConfirmModal } from 'components/layout/Modal';
import { H1, P, B } from 'components/layout/Text';
import { Warning } from 'components/layout/Alerts';

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

const DeleteConfirm = ({ isOpen, onConfirm, onClose }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            style={style}
            footer={<Footer onConfirm={onConfirm} onClose={onClose} />}>
            <Box pb={3}>
                <H1>Delete advert?</H1>
                <P>
                    <B>Please be certain this is what you want to do.</B>
                </P>
                <Warning>
                    Deleting an advert is irreversible.
                </Warning>
            </Box>
        </ConfirmModal>
    );
};

DeleteConfirm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DeleteConfirm;
