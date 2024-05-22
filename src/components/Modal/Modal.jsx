import React from 'react';
import RModal from 'react-modal';

import styleVariables from 'Styles/variables.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: styleVariables.background,
    border: 'none',
    color: 'white',
    width: '500px',
    textAlign: 'center',
    borderRadius: '15px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
};

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <RModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
    >
      {children}
    </RModal>
  )
};

export default Modal;
