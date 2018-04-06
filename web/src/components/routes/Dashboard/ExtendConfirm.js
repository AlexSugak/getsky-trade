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

const ExtendConfirm = ({ isOpen, onConfirm, onClose }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            style={style}
            footer={<Footer onConfirm={onConfirm} onClose={onClose} />}>
            <Box pb={3}>
                <H1>Extend advert?</H1>
                <P>Extending an advert
                    <B> increases the expiration date by 4 weeks.</B>
                </P>
                <Warning>
                    If you extend this advert, the new expiration date will be: <B>13 Sep '18 06:23 pm</B>
                </Warning>
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
