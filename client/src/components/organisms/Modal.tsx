import React, { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";

import AlertDialog, { Props as AlertDialogProps } from "../atoms/AlertDialog";

interface Props {
    show: boolean;
    handleClose: () => void;
    children?: React.ReactNode;
    className?: string;
    body?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    alertDialogProps?: AlertDialogProps;
    showAlertDialog?: boolean;
}

const CommonModal: FunctionComponent<Props> = (props: Props) => {
    return (
        <Modal
            className={"common-modal " + props.className}
            show={props.show}
            onHide={props.handleClose}
            centered={true}
        >
            {props.showAlertDialog && props.alertDialogProps && <AlertDialog {...props.alertDialogProps} />}
            <Modal.Header closeButton onHide={props.handleClose} className="common-modal-header">
                {props.header}
            </Modal.Header>
            <Modal.Body className="common-modal-body">{props.children}</Modal.Body>
            {props.footer && <Modal.Footer>{props.footer}</Modal.Footer>}
        </Modal>
    );
};

export default CommonModal;
