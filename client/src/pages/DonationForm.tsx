import React, { FunctionComponent, useState } from "react";

import DonationFormItemDetailsPage, { DonationForm as DonationFormType } from "./DonationFormItemDetailsPage";
import DonationFormConfirmationPage from "./DonationFormConfirmationPage";
import { DonationFormContact } from "../data/types/donationForm";
import DonationFormContactInfoPage from "./DonationFormContactInfoPage";
import DonationFormReviewPage from "./DonationFormReviewPage";

const DonationForm: FunctionComponent<Record<string, never>> = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [donor, setDonor] = useState<DonationFormContact | null>(null);
    const [donationForms, setDonationForms] = useState<Array<DonationFormType>>([]);
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
            donor={donor as DonationFormContact}
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
