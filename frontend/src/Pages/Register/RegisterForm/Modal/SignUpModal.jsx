import React from "react";
import { Modal } from "react-bootstrap";

const SignUpModal = ({ show, hide, message }) => {
  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>Checkk</Modal.Header>
      <Modal.Body>{message}</Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
