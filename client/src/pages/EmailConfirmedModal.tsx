import React, { FunctionComponent, useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";

import { handleVerifyEmail } from '../services/auth';
import LogoModal from '../components/organisms/LogoModal';

interface Props {
  actionCode: string
}

const EmailConfirmedModal: FunctionComponent<Props> = (props: Props) => {
  const [confirmationErrors, setConfirmationErrors] = useState('');
  const [showEmailConfirmedModal, setShowEmailConfirmedModal] = useState(false);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      handleVerifyEmail(props.actionCode)
        .then((err: string) => {
          setConfirmationErrors(err);
          if (!err) {
            setShowEmailConfirmedModal(true);
          }
        })
        .catch((err: string) => {
          setConfirmationErrors(err);
        });
    }
    verifyEmail();
  }, []);

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  return (
    <>
      { showEmailConfirmedModal &&
        <LogoModal show={true} title={"Email Confirmed"} subtitle={''} handleClose={() => setRedirect("/")} body={
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
        } />
      }
      {confirmationErrors && (confirmationErrors !== '') && "Your email could not be confirmed."}
    </>
  );
}

export default EmailConfirmedModal;
