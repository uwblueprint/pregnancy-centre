import React, { FunctionComponent, useState } from 'react';
import AuthModal from '../components/organisms/AuthModal';

const EmailConfirmedModal: FunctionComponent = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <AuthModal show={show} title={"Email Sent"} subtitle={''} handleClose={handleClose} body={
      <span>
        <div className="text">
          Check your email and click on the password reset link to reset the password to your account.
            <div className="text">
            The link will expire after X days, after which you’ll have to request another reset link.
            </div>
        </div>
        <button className="button" onClick={handleClose}>
          I understand
        </button>
      </span>
    }></AuthModal>
  );
}

export default EmailConfirmedModal;