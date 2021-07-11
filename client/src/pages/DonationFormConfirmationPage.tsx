import React, { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "../components/atoms/Button";
import DonationFormPage from "../components/layouts/DonationFormPage";

interface Props {
    donorEmail: string;
    pageNumber: number; // Index starting at 0
    steps: Array<string>;
}

const DonationFormConfirmationPage: FunctionComponent<Props> = (props: Props) => {
    const history = useHistory();
    return (
        <DonationFormPage
            className="donation-form-confirmation-page"
            includeContentHeader={false}
            includeFooter={false}
            pageNumber={props.pageNumber}
            steps={props.steps}
        >
            <h1>Thank you for submitting your Donation Form!</h1>
            <p>
                You will be receiving a confirmation email regarding your submission to{" "}
                <strong>{props.donorEmail}</strong>
            </p>
            <p>
                If you have any questions or concerns feel free to reach out to: rebeccaferguson@thepregnancycentre.ca
            </p>
            <p>Every item matters, your donation is greatly appreciated!</p>
            <Button text="Back to Main Donation Page" copyText="" onClick={() => history.push("/")} />
        </DonationFormPage>
    );
};

export default DonationFormConfirmationPage;
