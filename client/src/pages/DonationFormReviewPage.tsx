import React, { FunctionComponent } from "react";

import { DonationForm } from "../data/types/donationForm";
import { DonationFormContact } from "../data/types/donationForm";
import DonationFormPage from "../components/layouts/DonationFormPage";
import DonationItemCard from "../components/atoms/DonationItemCard";
import HorizontalDividerLine from "../components/atoms/HorizontalDividerLine";

interface Props {
    donor: DonationFormContact;
    donationForms: Array<DonationForm>;
    onNextPage: () => void;
    onPreviousPage: () => void;
    pageNumber: number; // Index starting at 0
    steps: Array<string>;
}

const DonationFormReviewPage: FunctionComponent<Props> = (props: Props) => {
    return (
        <DonationFormPage
            className="donation-form-review-page"
            includeContentHeader={true}
            includeFooter={true}
            nextButtonText="Submit Form"
            onNextPage={props.onNextPage}
            onPreviousPage={props.onPreviousPage}
            pageName={props.steps[props.pageNumber]}
            pageNumber={props.pageNumber}
            pageInstructions="Review the items you have entered, return to the previous page(s) through the back button if there are any changes that need to be made."
            previousButtonText="Back"
            steps={props.steps}
        >
            <div className="donor-details">
                <h1 className="donor-details-title">Contact Information Review</h1>
                <div className="donor-detail-field donor-name-field">{`Full Name: ${props.donor.firstName} ${props.donor.lastName}`}</div>
                <div className="donor-detail-field donor-email-field">{`Email: ${props.donor.email}`}</div>
                <div className="donor-detail-field donor-phone-number-field">{`Phone: ${props.donor.phoneNumber}`}</div>
            </div>
            <div className="donation-items">
                <h1 className="donation-items-title">Donation Basket Summary</h1>
                {props.donationForms.map((donationForm, idx) => (
                    <DonationItemCard
                        key={idx}
                        donationForm={donationForm}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        showDeleteIcon={false}
                        showEditIcon={false}
                    />
                ))}
                <HorizontalDividerLine />
                <div className="donation-items-total">
                    <h1>{props.donationForms.length}</h1>
                    <h2>Item Total</h2>
                </div>
            </div>
        </DonationFormPage>
    );
};

export default DonationFormReviewPage;
