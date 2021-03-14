import '../components/organisms/style/Modal.scss';
import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../components/organisms/Modal';

const EmailConfirmedModal: FunctionComponent = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <CommonModal show={show} title={"Email Confirmed"} handleClose={handleClose} body={
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
    }></CommonModal>
  );
}

export default EmailConfirmedModal;
