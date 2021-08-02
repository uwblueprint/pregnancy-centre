import { Dropdown, Spinner } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router";

import { sampleDonationForms, sampleRequests } from "../examples/MatchingRequestTableContainer";
import { DonationForm } from "../../data/types/donationForm";
import MatchingDonationFormView from "./MatchingDonationFormView";
import MatchingRequestsView from "./MatchingRequestsView";
import Request from "../../data/types/request";

interface ParamTypes {
    id: string;
}

const AdminDonationMatchingBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();

    const [curDonationForm, setCurDonationForm] = useState<DonationForm | null>(null);

    const [requests, setRequests] = useState<Request[]>([]);

    const [totalQuantitySelected, setTotalQuantitySelected] = useState(0);
    const [isMatching, setIsMatching] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [matchingError, setMatchingError] = useState("");
    const [hasRequestGroup, setHasRequestGroup] = useState(false);

    const query = gql`
        query donationForm($id: ID) {
            donationForm(_id: $id) {
                _id
                contact {
                    firstName
                    lastName
                    email
                    phoneNumber
                }
                name
                description
                requestGroup {
                    _id
                    requestTypes {
                        _id
                        name
                        deleted
                        openRequests {
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
                condition
                adminNotes
                quantityRemaining
                donatedAt
                createdAt
                deletedAt
            }
        }
    `;

    const openRequestsQuery = gql`
        query getOpenRequests {
            openRequests{
                _id
                quantity
                clientName
                createdAt
                matchedDonations{
                    donationForm
                    quantity
                }
            }
        }
    `;

    useQuery(query, {
        variables: { id: id },
        onCompleted: (data: { donationForm: DonationForm }) => {
            const res = JSON.parse(JSON.stringify(data.donationForm)); // deep-copy since data object is frozen
            setCurDonationForm(res);
            if (res.requestGroup !== null){
                setHasRequestGroup(true);
            }
        }
    });

    useQuery(openRequestsQuery, {
        skip: hasRequestGroup,
        onCompleted: (data: {openRequests: [Request]}) => {
            const res = JSON.parse(JSON.stringify(data.openRequests)); 
            setRequests(res);
        }
    });
    
    useEffect(() => {
        if (isMatching && curDonationForm !== null) {
            // check if quantities selected exceed the available donation amount
            const totalAvailable = curDonationForm!.quantity as number;
            
            setMatchingError(
                totalQuantitySelected > totalAvailable
                    ? "You have selected more than the maximum amount available. Please change the total quantity to be less than 5."
                    : ""
            );
        }
    }, [totalQuantitySelected, isMatching]);

    //     if (error) console.log(error.graphQLErrors);

    useEffect(() => {
        if (curDonationForm !== undefined) {
            // TODO: set total number of matched requests
        }
    }, [curDonationForm]);

    const onConfirmMatches = () => {
        if (matchingError == "") {
            // TODO: save changes: mutation to update requests and donationForm
        }
        setIsSaved(true);
    };

    /*
     * Updates the requests when a new quantity is selected for the given request
     */
    const onQuantityChanged = (newQuantity: number, requestId: string) => {
        // find the index of the updated request
        const reqIndex = requests.findIndex((req) => req._id == requestId);
        const req = requests[reqIndex];

        const contributionIndex = req?.matchedDonations?.findIndex(
            (contrib) => contrib.donationForm == curDonationForm!._id
        ) as number;

        // update the matching selection
        const newMatches = req?.matchedDonations;
        if (newMatches) {
            if (contributionIndex != -1) {
                newMatches[contributionIndex].quantity = newQuantity;
            } else {
                newMatches.push({ donationForm: curDonationForm!._id as string, quantity: newQuantity });
            }
        }

        // update requests with new donation matches
        setRequests([
            ...requests.slice(0, reqIndex),
            {
                ...req,
                matchedDonations: newMatches
            },
            ...requests.slice(reqIndex + 1)
        ]);

        // TODO: update total quantity selected
        setTotalQuantitySelected(0);
    };

    const onBrowseAvailableDonationForms = () => {
        setMatchingError("");
        setIsMatching(false);
    };

    return (
        <div className="admin-donation-matching-browser">
            {curDonationForm == undefined ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <div className="admin-donation-matching-browser-content">
                    <div className="admin-donation-matching-browser-requests">
                        <MatchingRequestsView
                            requests={requests}
                            donationForm={curDonationForm}
                            isMatching={isMatching}
                            isErroneous={matchingError !== ""}
                            onQuantitySelected={onQuantityChanged}
                        />
                    </div>
                    <div className="admin-donation-matching-browser-form-details">
                        <MatchingDonationFormView
                            donationForm={curDonationForm}
                            isSaved={isSaved}
                            isMatching={isMatching}
                            matchingError={matchingError}
                            onBrowseDonationForms={onBrowseAvailableDonationForms}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDonationMatchingBrowser;
