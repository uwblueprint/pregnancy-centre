import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";

import {
    DonationForm,
    DonationFormContributionTuple,
    ItemStatus,
    UpdateRequestsInput
} from "../../data/types/donationForm";
import AlertDialog from "../atoms/AlertDialog";
import MatchingDonationFormView from "./MatchingDonationFormView";
import MatchingRequestsView from "./MatchingRequestsView";
import Request from "../../data/types/request";
import RequestGroup from "../../data/types/requestGroup";
import { useHistory } from "react-router-dom";

interface AdminDonationMatchingBrowserProps {
    setHasUnsavedChanges: (arg: React.SetStateAction<boolean>) => void;
}
interface ParamTypes {
    id: string;
}

type UpdateRequestsInfo = UpdateRequestsInput & { quantity: number };

const AdminDonationMatchingBrowser: FunctionComponent<AdminDonationMatchingBrowserProps> = (
    props: AdminDonationMatchingBrowserProps
) => {
    const { id } = useParams<ParamTypes>();
    const history = useHistory();

    const [curDonationForm, setCurDonationForm] = useState<DonationForm | null>(null);
    const [availableDonations, setAvailableDonations] = useState<DonationForm[]>([]);
    const [lastDonationFormState, setLastDonationFormState] = useState<DonationForm | null>(null);
    const [hasRequestGroup, setHasRequestGroup] = useState(false);

    const [requests, setRequests] = useState<Request[]>([]);
    const [updatedRequestsInput, setUpdatedRequestsInput] = useState<UpdateRequestsInfo[]>([]);
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

    const fulfillRequestMutation = gql`
        mutation FulfillRequest($_id: ID) {
            fulfillRequest(_id: $_id) {
                _id
            }
        }
    `;

    useQuery(initialDonationFormQuery, {
        variables: { id: id },
        skip: curDonationForm != null,
        onCompleted: (data: { donationForm: DonationForm }) => {
            const res = JSON.parse(JSON.stringify(data.donationForm));
            initDonationForm(res);
            setHasRequestGroup(res.requestGroup != null);
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
            // filter out requests that are fulfilled
            const res: Request[] = JSON.parse(JSON.stringify(data.openRequests));
            const unfulfilledRequests = res.filter((req) => !req.fulfilled);
            setRequests(unfulfilledRequests);
        }
    });

    const [updateRequests] = useMutation(updateRequestsMutation);
    const [updateDonationForm] = useMutation(updateDonationFormMutation);
    const [fulfillRequest] = useMutation(fulfillRequestMutation);

    useEffect(() => {
        props.setHasUnsavedChanges(!isSaved && updatedRequestsInput.length > 0);
    }, [isSaved, updatedRequestsInput.length]);

    useEffect(() => {
        resetMatchingState();
        const donationForm = availableDonations.find((donation) => donation._id === id);
        // switch to new donation form selected
        if (donationForm) {
            // initialize with a deep copy
            const newDonationForm = JSON.parse(
                JSON.stringify({ ...donationForm, requestGroup: curDonationForm?.requestGroup })
            );
            initDonationForm(newDonationForm);
        }
        setIsMatching(true);
    }, [id]);

    useEffect(() => {
        // error detection
        if (isMatching && curDonationForm !== null) {
            const totalAvailable = curDonationForm!.quantity!;
            setMatchingError(
                totalQuantitySelected > totalAvailable
                    ? `You have selected more than the maximum amount available. Please change the total quantity to be less than or equal to ${totalAvailable}.`
                    : ""
            );
        }
    }, [totalQuantitySelected, isMatching]);

    const initDonationForm = (donationForm: DonationForm) => {
        setCurDonationForm(donationForm);
        saveCurrentState(donationForm);

        // update quantity matched
        const totalMatched = donationForm!.quantity! - donationForm!.quantityRemaining!;
        setTotalQuantitySelected(totalMatched);
    };

    const saveCurrentState = (curState: DonationForm) => {
        setLastDonationFormState(JSON.parse(JSON.stringify(curState)));
    };

    const resetMatchingState = () => {
        setMatchingError("");
        setIsSaved(false);
        setUpdatedRequestsInput([]);
        setTotalQuantitySelected(0);
    };

    const onConfirmMatches = () => {
        if (matchingError === "") {
            // if request is fully matched, mark as fulfilled
            for (const match of updatedRequestsInput) {
                const totalMatched = match.matchedDonations?.reduce((total, contrib) => total + contrib.quantity, 0);
                if (totalMatched === match.quantity) {
                    fulfillRequest({ variables: { _id: match._id } });
                }
            }

            // update requests with new matched donations
            const updatedRequestMatches: UpdateRequestsInput[] = updatedRequestsInput.map((info) => ({
                _id: info._id!,
                matchedDonations: info.matchedDonations!
            }));
            updateRequests({
                variables: { requests: updatedRequestMatches }
            });

            const newQuantityRemaining = curDonationForm?.quantityRemaining;
            updateDonationForm({
                variables: {
                    donationForm: {
                        _id: curDonationForm?._id,
                        quantityRemaining: newQuantityRemaining,
                        ...(newQuantityRemaining === 0 && { matchedAt: Date.now().toString() }),
                        ...(newQuantityRemaining === 0 && { status: ItemStatus.MATCHED })
                    }
                }
            });

            // update local values
            saveCurrentState(curDonationForm!);
            setIsSaved(true);
            setUpdatedRequestsInput([]);

            if (hasRequestGroup) {
                // update quantity remaining in available donation forms list
                const donationInList = availableDonations.find((donation) => donation._id === curDonationForm?._id);
                if (donationInList) {
                    donationInList.quantityRemaining = curDonationForm?.quantityRemaining;
                    setAvailableDonations(availableDonations);
                }
            }
        }
    };

    /*
     * Keeps track of the requests whose quantities have been changed throughout matching.
     */
    const updateModifiedRequests = (
        requestId: string,
        originalQuantity: number,
        newMatches: DonationFormContributionTuple[]
    ) => {
        const newInput = updatedRequestsInput;
        const reqIndex = newInput!.findIndex((input) => input._id === requestId);
        const newMatchRequest = {
            _id: requestId,
            matchedDonations: newMatches,
            quantity: originalQuantity
        };

        if (reqIndex !== -1) {
            newInput![reqIndex] = newMatchRequest;
        } else {
            newInput!.push(newMatchRequest);
        }
        setUpdatedRequestsInput(newInput);
    };

    const onQuantityChanged = (newQuantity: number, request: Request) => {
        // update the matchedDonations array with the new contribution
        const newMatchedDonations = request.matchedDonations!;
        const matchIndex = newMatchedDonations.findIndex((contrib) => contrib.donationForm === curDonationForm!._id);
        let prevQuantity = 0;
        if (matchIndex !== -1) {
            prevQuantity = newMatchedDonations[matchIndex!].quantity;
            newMatchedDonations[matchIndex!].quantity = newQuantity;
        } else {
            newMatchedDonations.push({ donationForm: curDonationForm!._id!, quantity: newQuantity });
        }

        setIsSaved(false);

        // keep track of which requests have been modified
        updateModifiedRequests(request._id!, request.quantity!, newMatchedDonations!);

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
        // revert back to last saved state
        setIsMatching(false);
        resetMatchingState();
        setCurDonationForm(lastDonationFormState);
    };

    const onBrowseAvailableDonationForms = () => {
        if (!isSaved && updatedRequestsInput.length > 0) {
            setShowAlertDialog(true);
        } else {
            setIsMatching(false);
            resetMatchingState();
        }
    };

    const onDonationFormSelect = (newId: string) => {
        if (newId === curDonationForm?._id) {
            // same donation form as previous
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
