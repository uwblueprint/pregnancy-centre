import React, { FunctionComponent } from "react";

import DonationFormItemDetailsPage from "../../pages/DonationFormItemDetailsPage";

const DonationFormItemDetailsPageContainer: FunctionComponent<Record<string, never>> = () => {
    const steps = ["Contact Information", "Item Details", "Review and Confirm"];
    return (
        <DonationFormItemDetailsPage
            initialDonationForms={[]}
            onNext={(donationForms) => console.log(donationForms)}
            steps={steps}
            pageNumber={1}
        />
    );
};

export default DonationFormItemDetailsPageContainer;
