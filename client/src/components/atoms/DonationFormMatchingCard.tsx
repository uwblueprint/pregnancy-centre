import React, { FunctionComponent } from "react";
import moment from "moment";

import { Button } from "./Button";
import DonationForm from "../../data/types/donationForm";

interface DonationFormMatchingCardProps {
    donationForm: DonationForm;
    onSelectMatch: () => void;
    onViewForm: () => void;
}

const DonationFormMatchingCard: FunctionComponent<DonationFormMatchingCardProps> = (
    props: DonationFormMatchingCardProps
) => {
    const { donationForm, onSelectMatch, onViewForm } = props;
    return (
        <div className="donation-form-matching-card">
            <div className="header">
                <div className="header-text">
                    <h1>{`${donationForm.quantityRemaining}/${donationForm.quantity} items available`}</h1>
                    <h2>{moment(donationForm.createdAt).format("MMM D, YYYY, h:mm a")}</h2>
                </div>
                <Button text="Match" copyText="" onClick={onSelectMatch} />
            </div>
            {(donationForm?.contact?.firstName || donationForm?.contact?.lastName) && (
                <h2>{`Donated by: ${donationForm?.contact?.firstName ?? ""} ${
                    donationForm?.contact?.lastName ?? ""
                }`}</h2>
            )}
            {donationForm.adminNotes && donationForm.adminNotes.length !== 0 && (
                <h2>{`Notes: ${donationForm.adminNotes}`}</h2>
            )}
            <h3 onClick={onViewForm}>View original form</h3>
        </div>
    );
};

export default DonationFormMatchingCard;
