import React, { FunctionComponent } from "react";

import DonationFormContactInfoPage from "../organisms/DonationFormContactInfoPage";

const DonationFormContactInfoPageContainer: FunctionComponent<Record<string, never>> = () => {
    const steps = ["Contact Information", "Item Details", "Review and Confirm"];
    return <DonationFormContactInfoPage onNext={(donor) => console.log(donor)} steps={steps} />;
};

export default DonationFormContactInfoPageContainer;
