import React, { FunctionComponent } from "react";

import DonationItemForm from "../molecules/DonationItemForm";
import RequestGroup from "../../data/types/requestGroup";

const DonationItemFormContainer: FunctionComponent<Record<string, never>> = () => {
    const requestGroups: Array<RequestGroup> = [
        { _id: "1", name: "Bassinet" },
        { _id: "2", name: "Exersaucer" },
        { _id: "3", name: "Bag" }
    ];

    return (
        <>
            <h1 style={{ marginBottom: "50px" }}>Donation Item Form</h1>
            <div
                style={{
                    marginTop: "30px",
                    marginLeft: "30px",
                    marginBottom: "50px",
                    display: "flex",
                    flexDirection: "column",
                    width: "70%"
                }}
            >
                <DonationItemForm
                    onDelete={() => console.log("Delete")}
                    onSave={(donationForm) => console.log(donationForm)}
                    requestGroups={requestGroups}
                />
            </div>
            <h1 style={{ marginBottom: "50px" }}>Donation Item Form with unsaved form error</h1>
            <div
                style={{
                    marginTop: "30px",
                    marginLeft: "30px",
                    marginBottom: "50px",
                    display: "flex",
                    flexDirection: "column",
                    width: "70%"
                }}
            >
                <DonationItemForm
                    onDelete={() => console.log("Delete")}
                    onSave={(donationForm) => console.log(donationForm)}
                    requestGroups={requestGroups}
                    formDetailsError="Please save item to proceed to the next step."
                />
            </div>
        </>
    );
};

export default DonationItemFormContainer;
