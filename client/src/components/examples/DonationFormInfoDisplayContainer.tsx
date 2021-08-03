import React, { FunctionComponent } from "react";

import { DonationForm } from "../../data/types/donationForm";
import DonationFormInfoDisplay from "../organisms/DonationFormInfoDisplay";

const DonationFormInfoDisplayContainer: FunctionComponent<Record<string, never>> = () => {
    const donationForm: DonationForm = {
        adminNotes: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        age: 3,
        contact: {
            firstName: "Miley",
            lastName: "Cyrus"
        },
        description: "This bottle feeds lots of milk, you will be very happy with this bottle!",
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
                width: "50%"
            }}
        >
            <DonationFormInfoDisplay
                donationForm={donationForm}
                isMatching={true}
                onSelectMatch={() => console.log("Select Match")}
            />
        </div>
    );
};

export default DonationFormInfoDisplayContainer;
