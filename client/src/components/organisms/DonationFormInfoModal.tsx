import React, { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";

import { Button } from "../atoms/Button";
import CommonModal from "./Modal";
import { DonationForm } from "../../data/types/donationForm";
import { getItemAgeDescription } from "../utils/donationForm";

interface Props {
    donationForm: DonationForm;
    handleClose: () => void;
}

const DonationFormInfoModal: FunctionComponent<Props> = (props: Props) => {
    const contactFullName = [props.donationForm?.contact?.firstName, props.donationForm?.contact?.lastName]
        .filter((name) => name)
        .join(" ");
    const ageDescription = props.donationForm.age == null ? null : getItemAgeDescription(props.donationForm.age);

    return (
        <CommonModal
            className="donation-form-info-modal"
            show={true}
            handleClose={props.handleClose}
            header={<Modal.Title className="text-center">Donation Form</Modal.Title>}
            footer={<Button text="Close Form" onClick={props.handleClose} copyText="" />}
        >
            {props.donationForm.name && (
                <div className="item-name">
                    <span>{props.donationForm.name}</span>
                </div>
            )}
            {contactFullName && (
                <div className="field item-contact">
                    <i className="bi bi-person" />
                    <span>
                        <strong>Donated by:</strong> {contactFullName}
                    </span>
                </div>
            )}
            {props.donationForm.createdAt && (
                <div className="field form-submission-date">
                    <i className="bi bi-calendar-check-fill" />
                    <span>
                        <strong>Form filled on:</strong>{" "}
                        {moment(props.donationForm.createdAt).format("MMMM D, YYYY, h:mma")}
                    </span>
                </div>
            )}
            {props.donationForm.donatedAt && (
                <div className="field donation-date">
                    <i className="bi bi-cart-check-fill" />
                    <span>
                        <strong>Donated on:</strong>{" "}
                        {moment(props.donationForm.donatedAt).format("MMMM D, YYYY, h:mma")}
                    </span>
                </div>
            )}
            {props.donationForm.age && (
                <div className="field item-age">
                    <span>
                        <strong>Age:</strong> {ageDescription}
                    </span>
                </div>
            )}
            {props.donationForm.quantity != null && (
                <div className="field item-quantity">
                    <span>
                        <strong>Quantity:</strong> {props.donationForm.quantity}
                    </span>
                </div>
            )}
            {props.donationForm.description && (
                <div className="field item-description">
                    <i className="bi bi-clipboard" />
                    <span>
                        <strong>Item description:</strong> {props.donationForm.description}
                    </span>
                </div>
            )}
            {props.donationForm.adminNotes && (
                <div className="field admin-notes">
                    <i className="bi bi-paperclip" />
                    <span>
                        <strong>TPC notes:</strong> {props.donationForm.adminNotes}
                    </span>
                </div>
            )}
        </CommonModal>
    );
};

export default DonationFormInfoModal;
