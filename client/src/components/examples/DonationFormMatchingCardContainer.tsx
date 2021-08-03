import React, { FunctionComponent } from "react";

import { DonationForm } from "../../data/types/donationForm";
import DonationFormMatchingCard from "../atoms/DonationFormMatchingCard";

const DonationFormMatchingCardContainer: FunctionComponent<Record<string, never>> = () => {
    const donationForm: DonationForm = {
        // adminNotes: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        contact: {
            firstName: "Miley",
            lastName: "Cyrus"
        },
        createdAt: 1234,
        quantity: 5,
        quantityRemaining: 4
    };
    return (
        <div
            style={{
                marginTop: "30px",
                marginLeft: "30px",
                display: "flex",
                flexDirection: "column",
                width: "42%"
            }}
        >
            <DonationFormMatchingCard
                donationForm={donationForm}
                onSelectMatch={() => console.log("Select Match")}
                onViewForm={() => console.log("View Form")}
            />
        </div>
    );
};

export default DonationFormMatchingCardContainer;
