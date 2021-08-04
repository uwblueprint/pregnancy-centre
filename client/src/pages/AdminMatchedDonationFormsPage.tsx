import React, { FunctionComponent, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import AdminPage from "../components/layouts/AdminPage";
import { DonationForm } from "../data/types/donationForm";
import MatchedDonationFormsTable from "../components/molecules/MatchedDonationFormsTable";
import Nav from "react-bootstrap/Nav";
import { Spinner } from "react-bootstrap";

const AdminMatchedDonationFormsPage: FunctionComponent = () => {
    const [donationForms, setDonationForms] = useState<Array<DonationForm> | null>(null);

    const getDonationFormsQuery = gql`
        query GetDonationForms {
            donationForms: donationFormsPage(filterOptions: { deleted: false, status: MATCHED }, sortBy: MATCHED_AT) {
                _id
                contact {
                    firstName
                    lastName
                }
                name
                quantity
                matchedAt
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
        <div className="admin-matched-donation-forms-page">
            <AdminPage>
                <div className="page-header">
                    <Nav.Link className="link" href="/unmatched-forms">
                        Forms
                    </Nav.Link>
                    <Nav.Link className="link active" href="/matched-forms">
                        Matched
                    </Nav.Link>
                </div>
                {donationForms == null ? (
                    <Spinner animation="border" role="status" />
                ) : (
                    <MatchedDonationFormsTable initialDonationForms={donationForms} />
                )}
            </AdminPage>
        </div>
    );
};

export default AdminMatchedDonationFormsPage;
