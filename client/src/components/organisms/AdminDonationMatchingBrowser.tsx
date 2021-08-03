import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

import { DonationForm, DonationFormContributionTuple, UpdateRequestsInput } from "../../data/types/donationForm";
import MatchingDonationFormView from "./MatchingDonationFormView";
import MatchingRequestsView from "./MatchingRequestsView";
import Request from "../../data/types/request";
import RequestType from "../../data/types/requestType";
interface ParamTypes {
    id: string;
}

const AdminDonationMatchingBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();

    const [curDonationForm, setCurDonationForm] = useState<DonationForm | null>(null);
    const [hasRequestGroup, setHasRequestGroup] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [updatedRequestsInput, setUpdatedRequestsInput] = useState<UpdateRequestsInput[]>([]);
    const [totalQuantitySelected, setTotalQuantitySelected] = useState(0);
    const [isMatching, setIsMatching] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [matchingError, setMatchingError] = useState("");

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
    `;

    const updateRequestsMutation = gql`
        mutation updateRequests($requests: [UpdateRequestsInput]) {
            updateRequests(requests: $requests) {
                _id
            }
        }
    `;

    const updateDonationFormMutation = gql`
        mutation updateDonationForm($donationForm: UpdateDonationFormInput) {
            updateDonationForm(donationForm: $donationForm) {
                _id
            }
        }
    `;

    useQuery(query, {
        variables: { id: id },
        onCompleted: (data: { donationForm: DonationForm }) => {
            const res = JSON.parse(JSON.stringify(data.donationForm)); // deep-copy since data object is frozen
            setCurDonationForm(res);
            const totalMatched = res.quantity - res.quantityRemaining;
            setTotalQuantitySelected(totalMatched);

            if (res.requestGroup != null) {
                setHasRequestGroup(true);

                // set requests
                const openRequests = res.requestGroup.requestTypes.reduce(
                    (requests: Request[], requestType: RequestType) => {
                        return requests.concat(requestType.openRequests!);
                    },
                    []
                );
                setRequests(openRequests);
            }
        }
    });

    useQuery(openRequestsQuery, {
        skip: hasRequestGroup,
        onCompleted: (data: { openRequests: [Request] }) => {
            const res = JSON.parse(JSON.stringify(data.openRequests));
            setRequests(res);
        }
    });

    const [updateRequests, { data }] = useMutation(updateRequestsMutation);
    const [updateDonationForm] = useMutation(updateDonationFormMutation);

    useEffect(() => {
        if (isMatching && curDonationForm !== null) {
            const totalAvailable = curDonationForm!.quantity!;
            setMatchingError(
                totalQuantitySelected > totalAvailable
                    ? `You have selected more than the maximum amount available. Please change the total quantity to be less than ${
                          totalAvailable + 1
                      }.`
                    : ""
            );
        }
    }, [totalQuantitySelected, isMatching]);

    const onConfirmMatches = () => {
        if (matchingError === "") {
            updateRequests({
                variables: { requests: updatedRequestsInput }
            });
            updateDonationForm({
                variables: {
                    donationForm: {
                        _id: curDonationForm?._id,
                        quantityRemaining: curDonationForm?.quantityRemaining
                    }
                }
            });
            setIsSaved(true);
        }
    };

    /*
     * Updates the requests whose quantities have been changed.
     */
    const updateModifiedRequests = (requestId: string, newMatches: DonationFormContributionTuple[]) => {
        const newInput = updatedRequestsInput;
        const reqIndex = newInput!.findIndex((input) => input._id === requestId);
        const newMatchRequest = {
            _id: requestId,
            matchedDonations: newMatches
        };

        if (reqIndex !== -1) {
            newInput![reqIndex] = newMatchRequest;
        } else {
            newInput!.push(newMatchRequest);
        }
        setUpdatedRequestsInput(newInput);
    };

    /*
     * Updates the requests and donation form when a new quantity is selected for the given request
     */
    const onQuantityChanged = (newQuantity: number, requestId: string) => {
        // find the index of the updated request
        const reqIndex = requests.findIndex((req) => req._id === requestId);
        const req = requests[reqIndex];

        const contributionIndex = req?.matchedDonations?.findIndex(
            (contrib) => contrib.donationForm === curDonationForm!._id
        );

        // update the matching array
        let prevQuantity = 0;
        const newMatches = req.matchedDonations!;
        if (contributionIndex !== -1) {
            prevQuantity = newMatches[contributionIndex!].quantity;
            newMatches[contributionIndex!].quantity = newQuantity;
        } else {
            newMatches.push({ donationForm: curDonationForm!._id!, quantity: newQuantity });
        }

        // update new total quantity
        const newTotalSelected = totalQuantitySelected - prevQuantity + newQuantity;
        setTotalQuantitySelected(newTotalSelected);

        updateModifiedRequests(requestId, newMatches!);

        // update requests with new donation matches
        setRequests([
            ...requests.slice(0, reqIndex),
            {
                ...req,
                matchedDonations: newMatches
            },
            ...requests.slice(reqIndex + 1)
        ]);

        // update quantity remaining on donation form
        const totalAvailable = curDonationForm!.quantity!;
        if (newTotalSelected <= totalAvailable) {
            setCurDonationForm({
                ...curDonationForm,
                quantityRemaining: totalAvailable - newTotalSelected
            });
        }
    };

    const onBrowseAvailableDonationForms = () => {
        // TODO: show alert dialog?
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
                            onConfirmMatches={onConfirmMatches}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDonationMatchingBrowser;
