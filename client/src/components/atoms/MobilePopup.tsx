import React, { FunctionComponent } from "react";

import { Button } from "../atoms/Button";
import { Modal } from "react-bootstrap";

interface Props {
    show: boolean;
    handleClose: () => void;
    children?: React.ReactNode;
    className?: string;
    body?: React.ReactNode;
    header?: React.ReactNode;
}

const MobilePopup: FunctionComponent<Props> = (props: Props) => {
    return (
        <Modal
            className={"mobile-popup " + props.className}
            show={props.show}
            onHide={props.handleClose}
            centered={true}
        >
            <Modal.Header closeButton onHide={props.handleClose} className="mobile-popup-header">
                {props.header}
            </Modal.Header>
            <Modal.Body className="mobile-popup-body">
                <p>
                    Our donation platform is optimized for bigger screens. For the best experience, TPC recommends to
                    use this platform on a desktop browser.{" "}
                </p>
                <div className="mobile-popup-actionarea">
                    <Button
                        className="mobile-popup-continue-button"
                        text="continue"
                        copyText=""
                        onClick={props.handleClose}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default MobilePopup;
