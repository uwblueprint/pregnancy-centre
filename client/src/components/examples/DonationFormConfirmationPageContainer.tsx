import React, { FunctionComponent } from "react";

import DonationFormConfirmationPage from "../../pages/DonationFormConfirmationPage";

const DonationFormConfirmationPageContainer: FunctionComponent<Record<string, never>> = () => {
    const steps = ["Contact Information", "Item Details", "Review and Confirm"];
    return <DonationFormConfirmationPage donorEmail="jane.doe@gmail.com" pageNumber={3} steps={steps} />;
};

export default DonationFormConfirmationPageContainer;
