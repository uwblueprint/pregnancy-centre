import React, { FunctionComponent } from "react";

import DonationForm from "../../data/types/donationForm";
import DonationFormInfoDisplay from "../organisms/DonationFormInfoDisplay";

const DonationFormInfoDisplayContainer: FunctionComponent<Record<string, never>> = () => {
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
    // const donationFormWithoutNotes: DonationForm = {
    //     contact: {
    //         firstName: "Miley",
    //         lastName: "Cyrus"
    //     },
    //     createdAt: new Date(),
    //     quantity: 5,
    //     quantityRemaining: 4
    // };
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
            {/* <h3 style={{ marginTop: "30px" }}>Donation form with notes</h3> */}
            <DonationFormInfoDisplay
                donationForm={donationForm}
                isMatching={true}
                onSelectMatch={() => console.log("Select Match")}
            />
            {/* <h3 style={{ marginTop: "30px" }}>Donation form without notes</h3>
            <DonationFormInfoDisplay
                donationForm={donationFormWithoutNotes}
                onSelectMatch={() => console.log("Select Match")}
            /> */}
        </div>
    );
};

export default DonationFormInfoDisplayContainer;
