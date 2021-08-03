import React, { FunctionComponent } from "react";

import { DonationForm } from "../../data/types/donationForm";
import DonationFormInfoModal from "../organisms/DonationFormInfoModal";

const DonationFormInfoModalContainer: FunctionComponent<Record<string, never>> = () => {
    const donationForm: DonationForm = {
        adminNotes: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        age: 3,
        contact: {
            firstName: "Miley",
            lastName: "Cyrus"
        },
        description: "This bottle feeds lots of milk, you will be very happy with this bottle!",
        donatedAt: new Date(),
        createdAt: new Date(),
        name: "Bottles",
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
            <DonationFormInfoModal
                donationForm={donationForm}
                handleClose={() => {
                    console.log("Close");
                }}
            />
        </div>
    );
};

export default DonationFormInfoModalContainer;
