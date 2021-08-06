import { Modal, Spinner } from "react-bootstrap";
import React, { FunctionComponent } from "react";

import { Props as AlertDialogProps } from "../atoms/AlertDialog";
import { Button } from "../atoms/Button";
import CommonModal from "./Modal";

interface Props {
    className?: string;
    title: string;
    show: boolean;
    handleClose(): void;
    children: React.ReactNode;
    submitButtonText: string;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    alertDialogProps?: AlertDialogProps;
    showAlertDialog?: boolean;
    loading?: boolean;
}

const FormModal: FunctionComponent<Props> = (props: Props) => {
    return (
        <CommonModal
            className={"form-modal " + props.className}
            show={props.show}
            handleClose={props.handleClose}
            header={<Modal.Title className="text-center">{props.title}</Modal.Title>}
            alertDialogProps={props.alertDialogProps}
            showAlertDialog={props.showAlertDialog}
        >
            {props.loading ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <form onSubmit={props.onSubmit}>
                    {props.children}
                    <div className="form-modal-buttons">
                        <Button
                            className="form-modal-cancel-button"
                            text="Cancel"
                            copyText=""
                            onClick={(e) => {
                                e.preventDefault();
                                props.onCancel();
                            }}
                        />
                        <Button
                            className="form-modal-submit-button"
                            text={props.submitButtonText}
                            copyText=""
                            onClick={(e) => {
                                e.preventDefault();
                                props.onSubmit(e);
                            }}
                            type="submit"
                        />
                    </div>
                </form>
            )}
        </CommonModal>
    );
};

export default FormModal;
