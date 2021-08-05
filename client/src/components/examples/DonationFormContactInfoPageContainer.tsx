import React, { FunctionComponent } from "react";

import DonationFormContactInfoPage from "../../pages/DonationFormContactInfoPage";

const DonationFormContactInfoPageContainer: FunctionComponent<Record<string, never>> = () => {
    const steps = ["Contact Information", "Item Details", "Review and Confirm"];
    return <DonationFormContactInfoPage onNext={(donor) => console.log(donor)} pageNumber={0} steps={steps} />;
};

export default DonationFormContactInfoPageContainer;
