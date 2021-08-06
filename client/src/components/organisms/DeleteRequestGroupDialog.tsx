import React, { FunctionComponent } from "react";

import FormModal from "./FormModal";

interface Props {
    requestGroupName?: string;
    handleClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    numRequests: number;
}

const DeleteRequestTypeDialog: FunctionComponent<Props> = (props: Props) => {
    return (
        <FormModal
            className="delete-request-group-form"
            submitButtonText="Confirm"
            title="Delete Need"
            handleClose={props.handleClose}
            show={true}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <div>
                <p>
                    Are you sure you want to delete the need{" "}
                    <b>&#34;{props.requestGroupName ? props.requestGroupName : ""}&#34;</b>? This will delete the{" "}
                    <b>{props.numRequests}</b> requests in this need and cannot be undone.
                </p>
            </div>
        </FormModal>
    );
};

export default DeleteRequestTypeDialog;
