import { gql, useMutation } from "@apollo/client";
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
    const createDonationFromMutation = gql`
        mutation CreateDonationForm(
            $age: Int!
            $condition: DonationItemCondition!
            $description: String
            $email: String
            $firstName: String
            $lastName: String
            $name: String!
            $phoneNumber: String
            $quantity: Int!
            $requestGroup: ID
        ) {
            donationForm: createDonationForm(
                donationForm: {
                    age: $age
                    condition: $condition
                    contact: { email: $email, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber }
                    description: $description
                    name: $name
                    quantity: $quantity
                    quantityRemaining: $quantity
                    requestGroup: $requestGroup
                    status: PENDING_APPROVAL
                }
            ) {
                _id
            }
        }
    `;

    const [createDonationForm] = useMutation(createDonationFromMutation, {
        onError: (error) => {
            console.log(error);
        }
    });

    const onSubmit = () => {
        const createDonationFormPromises = props.donationForms.map((donationForm) =>
            createDonationForm({
                variables: {
                    age: donationForm.age,
                    condition: donationForm.condition,
                    description: donationForm.description,
                    email: props.donor.email,
                    firstName: props.donor.firstName,
                    lastName: props.donor.lastName,
                    name: donationForm.name,
                    phoneNumber: props.donor.phoneNumber,
                    quantity: donationForm.quantity,
                    requestGroup: donationForm.requestGroup?._id
                }
            })
        );

        Promise.all(createDonationFormPromises)
            .then((results) => {
                const donationFormIds = results.map((result) => result.data.donationForm._id);
                console.log(donationFormIds);
            })
            .then(() => {
                props.onNextPage();
            });
    };

    return (
        <DonationFormPage
            className="donation-form-review-page"
            includeContentHeader={true}
            includeFooter={true}
            nextButtonText="Submit Form"
            onNextPage={onSubmit}
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
