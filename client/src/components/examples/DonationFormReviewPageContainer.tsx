import React, { FunctionComponent } from "react";

import DonationFormReviewPage from "../../pages/DonationFormReviewPage";
import { ItemCondition } from "../../data/types/donationForm";

const DonationFormReviewPageContainer: FunctionComponent<Record<string, never>> = () => {
    const steps = ["Contact Information", "Item Details", "Review and Confirm"];
    const donor = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        phoneNumber: "111-111-1111"
    };
    const donationForms = [
        {
            age: 1,
            condition: ItemCondition.FAIR,
            description: "",
            name: "Bassinet",
            quantity: 1
        },
        {
            age: 1,
            condition: ItemCondition.FAIR,
            description: "test1234",
            name: "Exersaucer",
            quantity: 1
        }
    ];
    return (
        <DonationFormReviewPage
            donor={donor}
            donationForms={donationForms}
            onPreviousPage={() => console.log("Back")}
            onNextPage={() => console.log("Submit Form")}
            pageNumber={2}
            steps={steps}
        />
    );
};

export default DonationFormReviewPageContainer;
