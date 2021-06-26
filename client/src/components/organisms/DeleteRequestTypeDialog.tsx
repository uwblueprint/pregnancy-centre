import React, { FunctionComponent } from 'react';

import FormModal from '../organisms/FormModal';


interface Props {
  requestTypeName?: string;
  requestGroupName?: string;
  handleClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  numRequests: number;
}

const DeleteRequestTypeDialog: FunctionComponent<Props> = (props: Props) => {
  return (
    <FormModal
      className='delete-request-type-form'
      submitButtonText='Confirm'
      title="Delete Type"
      handleClose={props.handleClose}
      show={true}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
    >
      <div className="delete-request-type-form-content">
        <p>Are you sure you want to delete <b>&#34;{props.requestTypeName ?? "this"}&#34;</b> as a type in the group <b>&#34;{props.requestGroupName ?? ""}&#34;</b>? This will delete all <b>{props.numRequests}</b> requests within this type and cannot be undone.</p>
      </div>
    </FormModal>
  )
}

export default DeleteRequestTypeDialog;
