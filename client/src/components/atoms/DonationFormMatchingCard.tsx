import React, { FunctionComponent } from "react";
import moment from "moment";

import { Button } from "./Button";
import { DonationForm } from "../../data/types/donationForm";

interface DonationFormMatchingCardProps {
    donationForm: DonationForm;
    onSelectMatch: () => void;
    onViewForm: () => void;
}

const DonationFormMatchingCard: FunctionComponent<DonationFormMatchingCardProps> = (
    props: DonationFormMatchingCardProps
) => {
    const contactFullName = [props.donationForm?.contact?.firstName, props.donationForm?.contact?.lastName]
        .filter((name) => name)
        .join(" ");
    let itemsAvailableStr = "";
    if (props.donationForm.quantityRemaining != null) {
        itemsAvailableStr = itemsAvailableStr.concat(props.donationForm.quantityRemaining.toString());
        if (props.donationForm.quantity != null) {
            itemsAvailableStr = itemsAvailableStr.concat("/" + props.donationForm.quantity.toString() + " ");
        }
    }
    itemsAvailableStr = itemsAvailableStr.concat(
        itemsAvailableStr.length === 0 ? "Items unavailable" : " items available"
    );
    return (
        <div className="donation-form-matching-card">
            <div className="header">
                <div className="header-text">
                    <h1>{itemsAvailableStr}</h1>
                    {props.donationForm.createdAt && (
                        <h2>{moment(props.donationForm.createdAt).format("MMM D, YYYY, h:mma")}</h2>
                    )}
                </div>
                <Button text="Match" copyText="" onClick={props.onSelectMatch} />
            </div>
            {contactFullName && <h2>{`Donated by: ${contactFullName}`}</h2>}
            {props.donationForm.adminNotes && <h2>{`Notes: ${props.donationForm.adminNotes}`}</h2>}
            <h3 onClick={props.onViewForm}>View donation form</h3>
        </div>
    );
};

export default DonationFormMatchingCard;
