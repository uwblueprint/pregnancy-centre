import React, { FunctionComponent } from "react";

import DonationFormContactInfoPage from "../organisms/DonationFormContactInfoPage";

const DonationFormContactInfoPageContainer: FunctionComponent<Record<string, never>> = () => {
    return <DonationFormContactInfoPage onNext={(donor) => console.log(donor)} />;
};

export default DonationFormContactInfoPageContainer;
