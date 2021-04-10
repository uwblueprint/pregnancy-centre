import React, { FunctionComponent, useState } from 'react';
import LogoModal from '../components/organisms/LogoModal';

const EmailConfirmedModal: FunctionComponent = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <LogoModal show={show} title={"Email Sent"} subtitle={''} handleClose={handleClose} body={
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
    }></LogoModal>
  );
}

export default EmailConfirmedModal;