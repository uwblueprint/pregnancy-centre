import React, { FunctionComponent } from "react";
import moment from "moment";

import { Button } from "../atoms/Button";
import DonationForm from "../../data/types/donationForm";
import { getItemAgeDescription } from "../utils/donationForm";

interface Props {
    donationForm: DonationForm;
    isMatching: boolean;
    onSelectMatch: () => void;
}

const DonationFormInfoDisplay: FunctionComponent<Props> = (props: Props) => {
    const { donationForm, isMatching, onSelectMatch } = props;
    const ageDescription = donationForm.age == null ? null : getItemAgeDescription(donationForm.age);
    const contactFullName = [donationForm?.contact?.firstName, donationForm?.contact?.lastName]
        .filter((name) => name)
        .join(" ");
    let itemsAvailableStr = "";
    if (donationForm.quantityRemaining != null) {
        itemsAvailableStr = itemsAvailableStr.concat(donationForm.quantityRemaining.toString());
        if (donationForm.quantity != null) {
            itemsAvailableStr = itemsAvailableStr.concat("/" + donationForm.quantity.toString() + " ");
        }
    }
    itemsAvailableStr = itemsAvailableStr.concat(
        itemsAvailableStr.length === 0 ? "Items unavailable" : " items available"
    );
    return (
        <div className="donation-form-info-display">
            <div className="header">
                <h1>{itemsAvailableStr}</h1>
                <Button
                    text={isMatching ? "Matching" : "Match"}
                    copyText=""
                    onClick={isMatching ? undefined : onSelectMatch}
                />
            </div>
            {donationForm.adminNotes && (
                <h2>
                    <strong>TPC Notes:</strong>
                    {donationForm.adminNotes}
                </h2>
            )}
            {contactFullName && (
                <h2>
                    <strong>Donated by:</strong>
                    {contactFullName}
                </h2>
            )}
            {donationForm.createdAt && (
                <h2>
                    <strong>Donated on:</strong>
                    {moment(donationForm.createdAt).format("MMMM D, YYYY, h:mma")}
                </h2>
            )}
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
