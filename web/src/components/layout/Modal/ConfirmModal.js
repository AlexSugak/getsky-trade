import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ConfirmModal = ({ isOpen, style, children, footer }) => {
    return (
        <Modal isOpen={isOpen} style={style}>
            {children}
            {footer}
        </Modal>
    );
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    footer: PropTypes.element.isRequired,
    style: PropTypes.object,
};

export default ConfirmModal;
