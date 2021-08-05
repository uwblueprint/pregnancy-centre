import React, { FunctionComponent } from "react";

import FormModal from "./FormModal";

interface Props {
    contactName: string | null;
    handleClose: () => void;
    itemName: string | null;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ConfirmDonationFormUnmatchDialog: FunctionComponent<Props> = (props: Props) => {
    const getItemNameHTML = (itemName: string | null) => {
        if (itemName) {
            return (
                <span>
                    &quot;<strong>{itemName}</strong>&quot;
                </span>
            );
        }
        return <span>a donation</span>;
    };

    const getContactNameHTML = (contactName: string | null) => {
        if (contactName) {
            return (
                <span>
                    &nbsp;from <strong>{contactName}</strong>
                </span>
            );
        }
        return null;
    };

    return (
        <FormModal
            className="confirm-donation-form-unmatch-dialog"
            submitButtonText="Confirm"
            title="Confirm Unmatch"
            handleClose={props.handleClose}
            show={true}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <div className="content">
                <span>
                    Are you sure you want to unconfirm {getItemNameHTML(props.itemName)}
                    {getContactNameHTML(props.contactName)}? This will move the item back to all Forms.
                </span>
            </div>
        </FormModal>
    );
};

export default ConfirmDonationFormUnmatchDialog;
