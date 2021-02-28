import './Modal.scss';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';

function ConfirmationModal(props: any) {
  // TODO(ellen): email should be passed in from props
  const [email, setEmail] = useState("anna@pregnancycentre.ca");
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} centered={true} className="modal">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <span>
        <div>
          <img src="TPC_leaf.png"></img>
        </div>
        <div className="title">
          Confirm Your Email
        </div>
          <div className="text">
            We’ve just sent an email to the following email address.
          </div>
          <div className="text link">
            {email}
          </div>
          <div className="text">
            You’ll have X time to open the confirmation link in the email to confirm that you own the email address.
          </div>
          <div className="text">
            You’ll then be able to login as an employee.
          </div>
          <button className="button" onClick={handleClose}>
            I understand
          </button>
        </span>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;

