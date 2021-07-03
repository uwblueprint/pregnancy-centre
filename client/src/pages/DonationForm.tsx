import React, { FunctionComponent, useState } from "react";

import DonationFormConfirmationPage from './DonationFormConfirmationPage'
import DonationFormContactInfoPage from './DonationFormContactInfoPage'
import DonationFormItemDetailsPage from './DonationFormItemDetailsPage'
import DonationFormReviewPage from './DonationFormReviewPage'

interface Props {
}

const DonationForm: FunctionComponent<Props> = (props: Props) => {
  const [pageNumber, setPageNumber] = useState(0);
  const formSteps  = ["Contact Information", "Item Details", "Review and Confirm"];
  const stepToPageMap = new Map(
    [1, <DonationFormContactInfoPage/>],
    [2, <DonationFormItemDetailsPage/>],
    [3, <DonationFormReviewPage/>],
    [4, <DonationFormConfirmationPage/>],
  )
    return stepToPageMap[pageNumber];
};

export default DonationFormConfirmationPage;
