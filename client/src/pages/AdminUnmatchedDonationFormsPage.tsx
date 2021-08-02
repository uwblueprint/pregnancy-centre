import React, { FunctionComponent, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import AdminPage from "../components/layouts/AdminPage";
import { DonationForm } from "../data/types/donationForm";
import { Spinner } from "react-bootstrap";
import UnmatchedDonationFormsTable from "../components/molecules/UnmatchedDonationFormsTable";

const AdminUnmatchedDonationFormPage: FunctionComponent = () => {
    const [donationForms, setDonationForms] = useState<Array<DonationForm> | null>(null);

    const getDonationFormsQuery = gql`
        query GetDonationForms {
            donationForms: donationFormsPage(filterOptions: { deleted: false, statusNot: MATCHED }) {
                _id
                adminNotes
                condition
                contact {
                    firstName
                    lastName
                    email
                    phoneNumber
                }
                createdAt
                name
                quantity
                status
            }
        }
    `;

    useQuery(getDonationFormsQuery, {
        fetchPolicy: "network-only",
        onCompleted: (data: { donationForms: Array<DonationForm> }) => {
            const donationFormsCopy: Array<DonationForm> = JSON.parse(JSON.stringify(data.donationForms)); // deep-copy since data object is frozen
            setDonationForms(donationFormsCopy);
        }
    });

    return (
        <div className="admin-unmatched-donation-forms-page">
            <AdminPage>
                <div className="page-header">
                    <span className="link active">Forms</span>
                    <span className="link">Matched</span>
                </div>
                {donationForms == null ? (
                    <Spinner animation="border" role="status" />
                ) : (
                    <UnmatchedDonationFormsTable initialDonationForms={donationForms} />
                )}
            </AdminPage>
        </div>
    );
};

export default AdminUnmatchedDonationFormPage;
