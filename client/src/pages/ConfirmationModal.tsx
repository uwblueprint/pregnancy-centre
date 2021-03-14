import '../components/organisms/style/Modal.scss';
import React, { FunctionComponent, useState } from 'react';
import CommonModal from '../components/organisms/Modal';

interface Props {
  email: string;
}

const ConfirmationModal: FunctionComponent<Props> = (props: Props) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <CommonModal show={show} title={"Confirm Your Email"} handleClose={handleClose} body={
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
