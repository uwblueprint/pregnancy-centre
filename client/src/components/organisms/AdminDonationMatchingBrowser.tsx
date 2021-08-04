import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

import { DonationForm, DonationFormContributionTuple, UpdateRequestsInput } from "../../data/types/donationForm";
import AlertDialog from "../atoms/AlertDialog";
import MatchingDonationFormView from "./MatchingDonationFormView";
import MatchingRequestsView from "./MatchingRequestsView";
import Request from "../../data/types/request";
import RequestGroup from "../../data/types/requestGroup";
import RequestType from "../../data/types/requestType";
import { useHistory } from "react-router-dom";
interface ParamTypes {
    id: string;
}

const AdminDonationMatchingBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const history = useHistory();

    const [availableDonations, setAvailableDonations] = useState<DonationForm[]>([]);
    const [curDonationForm, setCurDonationForm] = useState<DonationForm | null>(null);
    const [lastDonationFormState, setLastDonationFormState] = useState<DonationForm | null>(null);
    const [hasRequestGroup, setHasRequestGroup] = useState(false);

    const [requests, setRequests] = useState<Request[]>([]);
    const [updatedRequestsInput, setUpdatedRequestsInput] = useState<UpdateRequestsInput[]>([]);
    const [totalQuantitySelected, setTotalQuantitySelected] = useState(0);
    const [isMatching, setIsMatching] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [matchingError, setMatchingError] = useState("");
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const initialDonationFormQuery = gql`
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

    const donationsByRequestGroupQuery = gql`
        query AllDonationFormsByRequestGroup($id: ID) {
            requestGroup(_id: $id) {
                donationForms {
                    _id
                    contact {
                        firstName
                        lastName
                    }
                    name
                    age
                    description
                    quantity
                    quantityRemaining
                    createdAt
                    donatedAt
                    adminNotes
                }
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

    useQuery(initialDonationFormQuery, {
        variables: { id: id },
        skip: curDonationForm != null,
        onCompleted: (data: { donationForm: DonationForm }) => {
            const res = JSON.parse(JSON.stringify(data.donationForm)); // deep-copy since data object is frozen
            setCurDonationForm(res);
            const totalMatched = res.quantity - res.quantityRemaining;
            setTotalQuantitySelected(totalMatched);

            // save the initial state
            saveCurrentState(res);

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

    useQuery(donationsByRequestGroupQuery, {
        variables: { id: curDonationForm?.requestGroup?._id },
        skip: !hasRequestGroup || availableDonations.length > 0,
        onCompleted: (data: { requestGroup: RequestGroup }) => {
            const res = JSON.parse(JSON.stringify(data.requestGroup));
            setAvailableDonations(res.donationForms);
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
        // new donation form selected
        resetMatchingState();
        const donationForm = availableDonations.find((donation) => donation._id === id);
        if (donationForm) {
            const newDonationForm = JSON.parse(
                JSON.stringify({ ...donationForm, requestGroup: curDonationForm?.requestGroup })
            );
            setCurDonationForm(newDonationForm);
            saveCurrentState(newDonationForm);

            const totalMatched = donationForm!.quantity! - donationForm!.quantityRemaining!;
            setTotalQuantitySelected(totalMatched);
        }
        setIsMatching(true);
    }, [id]);

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

    const resetMatchingState = () => {
        setMatchingError("");
        setIsSaved(false);
        setUpdatedRequestsInput([]);
        setTotalQuantitySelected(0);
    };

    const saveCurrentState = (curState: DonationForm) => {
        setLastDonationFormState(JSON.parse(JSON.stringify(curState)));
    };

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
            setUpdatedRequestsInput([]);

            // save current donation form
            saveCurrentState(curDonationForm!);

            if (hasRequestGroup) {
                // update available donation forms with newly saved donation form
                const updatedDonations = availableDonations;
                const changedDonationIndex = updatedDonations.findIndex(
                    (donation) => donation._id === curDonationForm?._id
                );
                if (changedDonationIndex !== -1) {
                    updatedDonations[changedDonationIndex] = curDonationForm!;
                    setAvailableDonations(updatedDonations);
                }
            }
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

    const updateRequestMatches = (request: Request, newMatches: DonationFormContributionTuple[]) => {
        const reqIndex = requests.findIndex((req) => req._id === request._id);

        if (hasRequestGroup) {
            // update the request inside of the requestGroup
            const requestType = curDonationForm?.requestGroup?.requestTypes?.find(
                (type) => type._id === request?.requestType?._id
            );
            const foundRequest = requestType?.openRequests?.find((r) => r._id === request._id);
            foundRequest!.matchedDonations! = newMatches;
        }

        // update the request in the array
        setRequests([
            ...requests.slice(0, reqIndex),
            {
                ...request,
                matchedDonations: newMatches
            },
            ...requests.slice(reqIndex + 1)
        ]);
    };

    /*
     * Updates the requests and donation form when a new quantity is selected for the given request
     */
    const onQuantityChanged = (newQuantity: number, requestId: string) => {
        setIsSaved(false);
        const req = requests.find((req) => req._id === requestId);

        // update the matching array with the new contribution
        const contributionIndex = req?.matchedDonations?.findIndex(
            (contrib) => contrib.donationForm === curDonationForm!._id
        );
        let prevQuantity = 0;
        const newMatches = req!.matchedDonations!;
        if (contributionIndex !== -1) {
            prevQuantity = newMatches[contributionIndex!].quantity;
            newMatches[contributionIndex!].quantity = newQuantity;
        } else {
            newMatches.push({ donationForm: curDonationForm!._id!, quantity: newQuantity });
        }

        // update request object with new donation matches
        updateRequestMatches(req!, newMatches);

        // keep track of which requests have been modified
        updateModifiedRequests(requestId, newMatches!);

        // update new total quantity
        const newTotalSelected = totalQuantitySelected - prevQuantity + newQuantity;
        setTotalQuantitySelected(newTotalSelected);

        // update quantity remaining on donation form
        const totalAvailable = curDonationForm!.quantity!;
        if (newTotalSelected <= totalAvailable) {
            setCurDonationForm({
                ...curDonationForm,
                quantityRemaining: totalAvailable - newTotalSelected
            });
        }
    };

    const undoMatchingChanges = () => {
        setIsMatching(false);
        resetMatchingState();
        const prevState = JSON.parse(JSON.stringify(lastDonationFormState));
        setCurDonationForm(prevState);

        // update requests
        const prevRequests = prevState.requestGroup.requestTypes.reduce(
            (requests: Request[], requestType: RequestType) => {
                return requests.concat(requestType.openRequests!);
            },
            []
        );
        setRequests(prevRequests);
    };

    const onBrowseAvailableDonationForms = () => {
        // revert to previously saved state
        if (!isSaved && updatedRequestsInput.length > 0) {
            setShowAlertDialog(true);
        } else {
            setIsMatching(false);
            resetMatchingState();
        }
    };

    const onDonationFormSelect = (newId: string) => {
        if (newId === curDonationForm?._id) {
            setIsMatching(true);
            setTotalQuantitySelected(curDonationForm!.quantity! - curDonationForm!.quantityRemaining!);
        } else {
            history.push(`/matching/donation-form/${newId}`);
        }
    };

    return (
        <div className="admin-donation-matching-browser">
            {showAlertDialog && (
                <AlertDialog
                    dialogText="This matching has not been saved yet."
                    onExit={() => {
                        undoMatchingChanges();
                        setShowAlertDialog(false);
                    }}
                    onStay={() => setShowAlertDialog(false)}
                />
            )}
            {curDonationForm == null ? (
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
                            availableDonations={availableDonations}
                            isSaved={isSaved}
                            isMatching={isMatching}
                            matchingError={matchingError}
                            onBrowseDonationForms={onBrowseAvailableDonationForms}
                            onDonationFormSelect={onDonationFormSelect}
                            onConfirmMatches={onConfirmMatches}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDonationMatchingBrowser;
