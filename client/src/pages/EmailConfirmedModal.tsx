import React, { FunctionComponent, useState } from 'react';
import { Redirect } from "react-router-dom";

import CommonModal from '../components/organisms/Modal';

const EmailConfirmedModal: FunctionComponent = () => {
  const [redirect, setRedirect] = useState("");

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  return (
    <CommonModal show={true} title={"Email Confirmed"} subtitle={''} handleClose={() => setRedirect("/")} body={
      <span>
        <div className="text">
          Your account has now been made. 
        <div className="text">
          You can now log into your account with the button below or close this  window.        </div>
        </div>
        <button className="button" onClick={() => setRedirect("/login")}>
          Log in
        </button>
      </span>
    }></CommonModal>
  );
}

export default EmailConfirmedModal;
