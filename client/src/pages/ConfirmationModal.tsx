import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';

function ConfirmationModal(props: any) {

  const [email, setEmail] = useState("anna@pregnancycentre.ca");
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>

          <div>
            We’ve just sent an email to the following email address.
              </div>
          <div>
            {email}
          </div>
          <div>
            You’ll have X time to open the confirmation link in the email to confirm that you own the email address.
            You’ll then be able to login as an employee.
              </div>
          <button role="link">
            I understand
              </button>
        </span>

      </Modal.Body>
    </Modal>



  );
}

export default ConfirmationModal;

