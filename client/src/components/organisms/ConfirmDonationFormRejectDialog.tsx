import React, { FunctionComponent } from "react";

import FormModal from "./FormModal";

interface Props {
    contactName: string | null;
    itemName: string;
    handleClose: () => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ConfirmDonationFormRejectDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <FormModal
            className="confirm-donation-form-approval-dialog"
            submitButtonText="Confirm"
            title=""
            handleClose={props.handleClose}
            show={true}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <div className="content">
                <p>{`Confirm that you want to reject ${props.itemName} and send an email${
                    props.contactName == null ? "" : " to " + props.contactName
                }.`}</p>
            </div>
        </FormModal>
    );
};

export default ConfirmDonationFormRejectDialog;
