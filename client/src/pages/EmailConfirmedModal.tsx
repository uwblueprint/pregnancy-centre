import React, { FunctionComponent, useState } from 'react';
import AuthModal from '../components/organisms/AuthModal';

const EmailConfirmedModal: FunctionComponent = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <AuthModal show={show} title={"Email Confirmed"} subtitle={''} handleClose={handleClose} body={
      <span>
        <div className="text">
          Your account has now been made.
        <div className="text">
            You can now log into your account with the button below or close this  window.        </div>
        </div>
        <button className="button" onClick={handleClose}>
          Log in
        </button>
      </span>
    }></AuthModal>
  );
}

export default EmailConfirmedModal;
