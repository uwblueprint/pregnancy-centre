import React, { FunctionComponent } from "react";
import moment from "moment";

import DonationForm, { ItemAgeToDescriptionMap } from "../../data/types/donationForm";
import { Button } from "../atoms/Button";

interface Props {
    donationForm: DonationForm;
    isMatching: boolean;
    onSelectMatch: () => void;
}

const DonationFormInfoDisplay: FunctionComponent<Props> = (props: Props) => {
    const { donationForm, isMatching, onSelectMatch } = props;
    const ageDescription = ItemAgeToDescriptionMap.get(donationForm.age ?? -1);
    return (
        <div className="donation-form-info-display">
            <div className="header">
                <h1>{`${donationForm.quantityRemaining}/${donationForm.quantity} items available`}</h1>
                <Button
                    text={isMatching ? "Matching" : "Match"}
                    copyText=""
                    onClick={isMatching ? undefined : onSelectMatch}
                />
            </div>
            {donationForm.adminNotes && donationForm.adminNotes.length !== 0 && (
                <h2>
                    <strong>TPC Notes:</strong>
                    {donationForm.adminNotes}
                </h2>
            )}
            {(donationForm?.contact?.firstName || donationForm?.contact?.lastName) && (
                <h2>
                    <strong>Donated by:</strong>
                    {(donationForm?.contact?.firstName ?? "") + " " + (donationForm?.contact?.lastName ?? "")}
                </h2>
            )}
            <h2>
                <strong>Donated on:</strong>
                {moment(donationForm.createdAt).format("MMMM D, YYYY, h:mma")}
            </h2>
            {ageDescription && (
                <h2 className="age-field">
                    <strong>Age:</strong>
                    {ageDescription}
                </h2>
            )}
            {donationForm.quantity != null && (
                <h2 className="quantity-field">
                    <strong>Quantity:</strong>
                    {donationForm.quantity}
                </h2>
            )}
            {donationForm.description && (
                <h2>
                    <strong>Item description:</strong>
                    {donationForm.description}
                </h2>
            )}
        </div>
    );
};

export default DonationFormInfoDisplay;
