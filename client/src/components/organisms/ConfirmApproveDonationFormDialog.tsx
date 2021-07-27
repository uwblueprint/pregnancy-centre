import React, { FunctionComponent } from "react";

import FormModal from "../organisms/FormModal";

interface Props {
    contactName: string;
    handleClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const DeleteRequestTypeDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <FormModal
            className="confirm-approve-donation-form-dialog"
            submitButtonText="Confirm"
            title="Delete Type"
            handleClose={props.handleClose}
            show={true}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <div className="delete-request-type-form-content">
                <p>Confirm that you want to approve and send an email to {props.contactName}.</p>
            </div>
        </FormModal>
    );
};

export default DeleteRequestTypeDialog;
