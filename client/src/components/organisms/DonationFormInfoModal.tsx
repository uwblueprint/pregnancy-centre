import { Modal, Spinner } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import moment from "moment";

import { gql, useQuery } from "@apollo/client";
import { Button } from "../atoms/Button";
import CommonModal from "./Modal";
import { DonationForm } from "../../data/types/donationForm";
import { getItemAgeDescription } from "../utils/donationForm";

interface Props {
    donationForm?: DonationForm;
    donationFormId?: string;
    handleClose: () => void;
}

const DonationFormInfoModal: FunctionComponent<Props> = (props: Props) => {
    const [donationForm, setDonationForm] = useState<DonationForm | null>(props.donationForm ?? null);
    const contactFullName = [donationForm?.contact?.firstName, donationForm?.contact?.lastName]
        .filter((name) => name)
        .join(" ");
    const ageDescription = donationForm?.age == null ? null : getItemAgeDescription(donationForm.age);

    const getDonationFormQuery = gql`
        query GetDonationForm($id: ID!) {
            donationForm(_id: $id) {
                adminNotes
                age
                contact {
                    firstName
                    lastName
                }
                createdAt
                description
                donatedAt
                name
                quantity
            }
        }
    `;

    if (props.donationFormId) {
        useQuery(getDonationFormQuery, {
            variables: {
                id: props.donationFormId
            },
            fetchPolicy: "network-only",
            onCompleted: (data: { donationForm: DonationForm }) => {
                const donationFormCopy: DonationForm = JSON.parse(JSON.stringify(data.donationForm)); // deep-copy since data object is frozen
                setDonationForm(donationFormCopy);
                console.log(donationFormCopy);
            }
        });
    }

    return (
        <CommonModal
            className="donation-form-info-modal"
            show={true}
            handleClose={props.handleClose}
            header={<Modal.Title className="text-center">Donation Form</Modal.Title>}
            footer={<Button text="Close Form" onClick={props.handleClose} copyText="" />}
        >
            {donationForm == null ? (
                <Spinner animation="border" role="status" />
            ) : (
                <>
                    {donationForm.name && (
                        <div className="item-name">
                            <span>{donationForm.name}</span>
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
                    {donationForm.createdAt && (
                        <div className="field form-submission-date">
                            <i className="bi bi-calendar-check-fill" />
                            <span>
                                <strong>Form filled on:</strong>{" "}
                                {moment(donationForm.createdAt, "x").format("MMMM D, YYYY, h:mma")}
                            </span>
                        </div>
                    )}
                    {donationForm.donatedAt && (
                        <div className="field donation-date">
                            <i className="bi bi-cart-check-fill" />
                            <span>
                                <strong>Donated on:</strong>{" "}
                                {moment(donationForm.donatedAt, "x").format("MMMM D, YYYY, h:mma")}
                            </span>
                        </div>
                    )}
                    {donationForm.age && (
                        <div className="field item-age">
                            <span>
                                <strong>Age:</strong> {ageDescription}
                            </span>
                        </div>
                    )}
                    {donationForm.quantity != null && (
                        <div className="field item-quantity">
                            <span>
                                <strong>Quantity:</strong> {donationForm.quantity}
                            </span>
                        </div>
                    )}
                    {donationForm.description && (
                        <div className="field item-description">
                            <i className="bi bi-clipboard" />
                            <span>
                                <strong>Item description:</strong> {donationForm.description}
                            </span>
                        </div>
                    )}
                    {donationForm.adminNotes && (
                        <div className="field admin-notes">
                            <i className="bi bi-paperclip" />
                            <span>
                                <strong>TPC notes:</strong> {donationForm.adminNotes}
                            </span>
                        </div>
                    )}
                </>
            )}
        </CommonModal>
    );
};

export default DonationFormInfoModal;
