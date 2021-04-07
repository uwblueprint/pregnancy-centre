import React, { FunctionComponent, useState } from 'react';
import { Redirect } from "react-router-dom";

import CommonModal from '../components/organisms/Modal';

interface Props {
  email: string;
}

const ConfirmationModal: FunctionComponent<Props> = (props: Props) => {
  const [redirect, setRedirect] = useState("");

  const handleClose = () => setRedirect("/");

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  return (
    <CommonModal show={true} title={"Confirm Your Email"} subtitle={''} handleClose={handleClose} body={
      <span>
        <div className="text">
          We’ve just sent an email to the following email address.
        </div>
        <div className="text link">
          {props.email}
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
