import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';

import { Props as AlertDialogProps } from '../atoms/AlertDialog';
import { Button } from '../atoms/Button'
import CommonModal from "./Modal"

interface Props {
  className: string;
  title: string;
  show: boolean;
  handleClose(): void;
  children: React.ReactNode;
  submitButtonText: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  alertDialogProps?: AlertDialogProps;
  showAlertDialog?: boolean;
}

const FormModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <CommonModal
      className={`form-modal ` + props.className}
      show={props.show}
      handleClose={props.handleClose}
      header={<Modal.Title className="text-center">{props.title}</Modal.Title>}
      alertDialogProps={props.alertDialogProps}
      showAlertDialog={props.showAlertDialog}
    >
      <form onSubmit={props.onSubmit}>
        {props.children}
        <div className="form-modal-buttons">
          <Button className="form-modal-cancel-button" text="Cancel" copyText="" onClick={props.onCancel} />
          <Button className="form-modal-submit-button" text={props.submitButtonText} copyText="" onClick={props.onSubmit} type="submit" />
        </div>
      </form>
    </CommonModal>
  );
}

export default FormModal;
