import React, { FunctionComponent, useState } from "react";

import DonationFormConfirmationPage from "./DonationFormConfirmationPage";
import DonationFormContactInfoPage from "./DonationFormContactInfoPage";
import DonationFormI from "../data/types/donationForm";
import DonationFormItemDetailsPage from "./DonationFormItemDetailsPage";
import DonationFormReviewPage from "./DonationFormReviewPage";
import Donor from "../data/types/donor";

const DonationForm: FunctionComponent<Record<string, never>> = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [donor, setDonor] = useState<Donor | null>(null);
    const [donationForms, setDonationForms] = useState<Array<DonationFormI>>([]);
    const formSteps = ["Contact Information", "Item Details", "Review and Confirm"];
    const pagesArray = [
        <DonationFormContactInfoPage
            key={0}
            initialDonor={donor ?? undefined}
            onNext={(newDonor) => {
                setDonor(newDonor);
                setPageNumber(1);
            }}
            pageNumber={0}
            steps={formSteps}
        />,
        <DonationFormItemDetailsPage
            key={1}
            initialDonationForms={donationForms}
            onNext={(newDonationForms) => {
                setDonationForms(newDonationForms);
                setPageNumber(2);
            }}
            onPrevious={(newDonationForms) => {
                setDonationForms(newDonationForms);
                setPageNumber(0);
            }}
            pageNumber={1}
            steps={formSteps}
        />,
        <DonationFormReviewPage
            key={2}
            donor={donor as Donor}
            donationForms={donationForms}
            onNextPage={() => setPageNumber(3)}
            onPreviousPage={() => setPageNumber(1)}
            pageNumber={2}
            steps={formSteps}
        />,
        <DonationFormConfirmationPage key={3} donorEmail={donor?.email ?? ""} pageNumber={2} steps={formSteps} />
    ];

    return pagesArray[pageNumber];
};

export default DonationForm;
