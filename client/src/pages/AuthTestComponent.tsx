import React, { FunctionComponent, useEffect, useState } from 'react';
import EmailConfirmedModal from '../pages/EmailConfirmedModal';
import { handleVerifyEmail } from '../services/auth';

const AuthTestComponent: FunctionComponent = () => {
  // confirmationErrors is currently not being used, but will be used when we create error modals in later iterations
  const [confirmationErrors, setConfirmationErrors] = useState('');
  const [showEmailConfirmedModal, setShowEmailConfirmedModal] = useState(false);

  useEffect(() => {
    async function verifyEmail() {
      const URLParams = new URLSearchParams(window.location.href);
      const actionCode = URLParams.get("oobCode");
      if (actionCode) {
        handleVerifyEmail(actionCode)
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
    }
    verifyEmail();
  }, []); 

  return (
    <div>
      {showEmailConfirmedModal && 
        <EmailConfirmedModal></EmailConfirmedModal>
      }
      {(confirmationErrors !== '') && "Your email could not be confirmed."}
    </div>
  );
}

export default AuthTestComponent;
