import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import AdminPage from "../components/layouts/AdminPage";

import { DonationForm } from "../data/types/donationForm";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

import DonationFormInfoDisplay from "../components/organisms/DonationFormInfoDisplay";
import MatchingRequestsView from "../components/organisms/MatchingRequestsView";
import Request from "../data/types/request";

interface ParamTypes {
    id: string;
}

const AdminMatchedFormDetailsPage: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const [donationForm, setDonationForm] = useState<DonationForm | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);

    const hasRequestGroup = donationForm?.requestGroup != null;

    const donationFormQuery = gql`
        query donationForm($id: ID) {
            donationForm(_id: $id) {
                _id
                contact {
                    firstName
                    lastName
                }
                name
                description
                requestGroup {
                    _id
                    requestTypes {
                        _id
                        name
                        deleted
                        requests {
                            _id
                            quantity
                            requestType {
                                _id
                                name
                            }
                            clientName
                            createdAt
                            matchedDonations {
                                donationForm
                                quantity
                            }
                        }
                    }
                }
                quantity
                age
                adminNotes
                status
                quantityRemaining
                donatedAt
                createdAt
            }
        }
    `;

    const allRequestsQuery = gql`
        query getRequests {
            requests {
                _id
                quantity
                requestType {
                    _id
                    name
                }
                clientName
                createdAt
                matchedDonations {
                    donationForm
                    quantity
                }
            }
        }
    `;

    useQuery(donationFormQuery, {
        variables: { id: id },
        skip: donationForm != null,
        onCompleted: (data: { donationForm: DonationForm }) => {
            const res: DonationForm = JSON.parse(JSON.stringify(data.donationForm));
            setDonationForm(res);
        }
    });

    useQuery(allRequestsQuery, {
        skip: hasRequestGroup,
        onCompleted: (data: { requests: [Request] }) => {
            // filter out deleted requests
            const res: Request[] = JSON.parse(JSON.stringify(data.requests));
            const nonDeletedRequests = res.filter((req) => req.deletedAt == null);
            setRequests(nonDeletedRequests);
        }
    });

    return (
        <div className="admin-matched-form-details-page">
            <AdminPage>
                {donationForm == null ? (
                    <Spinner animation="border" role="status" />
                ) : (
                    <div className="admin-matched-form-details-page-content">
                        <div className="requests-view">
                            <MatchingRequestsView
                                requests={requests}
                                donationForm={donationForm}
                                previousPage="Matched items"
                                showFulfilledRequests={true}
                                showAssignedMatchesOnly={true}
                                isMatching={false}
                                isErroneous={false}
                                onQuantitySelected={() => {}}
                            />
                        </div>
                        <div className="form-details">
                            <DonationFormInfoDisplay
                                donationForm={donationForm}
                                isMatching={false}
                                viewOnly={true}
                                onSelectMatch={() => {}}
                            />
                        </div>
                    </div>
                )}
            </AdminPage>
        </div>
    );
};

export default AdminMatchedFormDetailsPage;
