import './Modal.scss';
import React, { useState } from 'react';
import CommonModal from '../components/organisms/Modal';

function ConfirmationModal(props: any) {
  const [email, setEmail] = useState(props.email);
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <CommonModal show={show} title={"Confirm Your Email"} handleClose={handleClose} body={
      <span>
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
    }></CommonModal>
  );
}

export default ConfirmationModal;
