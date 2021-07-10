import React, { FunctionComponent } from "react";

import DonationForm from "../../data/types/donationForm";
import DonationFormMatchingCard from "../atoms/DonationFormMatchingCard";

const DonationFormMatchingCardContainer: FunctionComponent<Record<string, never>> = () => {
    const donationForm: DonationForm = {
        adminNotes: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        contact: {
            firstName: "Miley",
            lastName: "Cyrus"
        },
        createdAt: new Date(),
        quantity: 5,
        quantityRemaining: 4
    };
    const donationFormWithoutNotes: DonationForm = {
        contact: {
            firstName: "Miley",
            lastName: "Cyrus"
        },
        createdAt: new Date(),
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
            <h3 style={{ marginTop: "30px" }}>Donation form with notes</h3>
            <DonationFormMatchingCard
                donationForm={donationForm}
                onSelectMatch={() => console.log("Select Match")}
                onViewForm={() => console.log("View Form")}
            />
            <h3 style={{ marginTop: "30px" }}>Donation form without notes</h3>
            <DonationFormMatchingCard
                donationForm={donationFormWithoutNotes}
                onSelectMatch={() => console.log("Select Match")}
                onViewForm={() => console.log("View Form")}
            />
        </div>
    );
};

export default DonationFormMatchingCardContainer;
