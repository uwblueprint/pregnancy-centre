import './Modal.scss';
import React, { useState } from 'react';
import CommonModal from '../components/organisms/CommonModal';

function ConfirmationModal(props: any) {
  // TODO(ellen): email should be passed in from props
  const [email, setEmail] = useState(props.email);

  return (
    <CommonModal title={"Confirm Your Email"} body={
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
        <button className="button">
          I understand
        </button>
      </span>
    }></CommonModal>
  );
}

export default ConfirmationModal;
