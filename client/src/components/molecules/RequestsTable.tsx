import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import moment from "moment";
import Table from "react-bootstrap/Table";

import Request from "../../data/types/request";
import RequestForm from "../organisms/RequestForm";
import WarningDialog from "../atoms/WarningDialog";

interface Props {
    requests: Request[];
    onChangeNumRequests?: (num: number) => void;
    changeRequest: (num: number) => void;
}

const RequestsTable: FunctionComponent<Props> = (props: Props) => {
    const [requests, setRequests] = useState(props.requests.filter((request) => request.deletedAt == null));
    const [requestSelectedForEditing, setRequestSelectedForEditing] = useState("");
    const [showWarningDialog, setShowWarningDialog] = useState(false);

    const headingList = ["Fulfilled", "Client Name", "Quantity", "Date Requested", ""];
    const fulfillRequest = gql`
        mutation FulfillRequest($_id: ID) {
            fulfillRequest(_id: $_id) {
                _id
            }
        }
    `;
    const unfulfillRequest = gql`
        mutation UnfulfillRequest($_id: ID) {
            unfulfillRequest(_id: $_id) {
                _id
            }
        }
    `;
    const deleteRequest = gql`
        mutation DeleteRequest($_id: ID) {
            deleteRequest(_id: $_id) {
                _id
            }
        }
    `;
    const changeDonationFormQuantity = gql`
        mutation ChangeDonationFormQuantity($_id: ID, $quantity: Int) {
            changeDonationFormQuantity(_id: $_id, quantity: $quantity) {
                _id
                quantity
            }
        }
    `;

    useEffect(() => {
        const nonFulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilledAt == null) {
                    return request;
                }
            }
        });
        const fulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilledAt != null) {
                    return request;
                }
            }
        });

        nonFulfilledRequests.sort((a, b) => {
            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });

        fulfilledRequests.sort((a, b) => {
            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });

        const sortedRequests: Request[] = nonFulfilledRequests!.concat(fulfilledRequests!) as Request[];
        setRequests(sortedRequests);
    }, [props.requests]);

    const [mutateDeleteRequest] = useMutation(deleteRequest);
    const [mutateFulfillRequest] = useMutation(fulfillRequest);
    const [mutateUnfulfillRequest] = useMutation(unfulfillRequest);
    const [mutateChangeDonationFormQuantity] = useMutation(changeDonationFormQuantity);

    const handleDeleteRequest = (index: number) => {
        const req = requests[index];
        if (req.fulfilledAt) {
            if (req.matchedDonations) {
                req.matchedDonations.forEach((item) => {
                    const id = item.donationForm;
                    const quantity = item.quantity;
                    mutateChangeDonationFormQuantity({ variables: { _id: id, quantity: -quantity } });
                });
            }
            onDeleteRequest(index);
        } else {
            let canDelete = true;
            const matchedDonations = req.matchedDonations;
            if (matchedDonations) {
                matchedDonations.forEach((item) => {
                    if (item.quantity > 0) {
                        canDelete = false;
                    }
                });
            }
            if (canDelete) {
                onDeleteRequest(index);
            } else {
                setShowWarningDialog(true);
            }
        }
    };
    const reorderRequests = (requests: Request[]) => {
        const nonFulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilledAt == null) {
                    return request;
                }
            }
        });
        const fulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilledAt != null) {
                    return request;
                }
            }
        });

        nonFulfilledRequests.sort((a, b) => {
            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });

        fulfilledRequests.sort((a, b) => {
            return a!.createdAt!.valueOf() - b!.createdAt!.valueOf();
        });

        const sortedRequests: Request[] = nonFulfilledRequests!.concat(fulfilledRequests!) as Request[];
        return sortedRequests;
    };

    const onDeleteRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = { ...requestsCopy[index] };
        requestsCopy.splice(index, 1);
        const id = req._id;
        props.onChangeNumRequests!(requestsCopy.length);
        setRequests(requestsCopy);
        mutateDeleteRequest({ variables: { _id: id } });
        props.changeRequest(-1);
    };
    const onFulfilledRequest = (request: Request) => {
        if (request._id == null) {
            return;
        }
        if (request.fulfilledAt) {
            mutateUnfulfillRequest({ variables: { _id: request._id } });
            const targetId = request._id;
            const tempRequests = requests.map((req) => {
                if (req._id === targetId) {
                    req.fulfilledAt = undefined;
                }
                return req;
            });
            const newSortedRequests = reorderRequests(tempRequests);
            setRequests(newSortedRequests);
        } else {
            mutateFulfillRequest({ variables: { _id: request._id } });
            const targetId = request._id;
            const tempRequests = requests.map((req) => {
                if (req._id === targetId) {
                    req.fulfilledAt = new Date();
                }
                return req;
            });
            const newSortedRequests = reorderRequests(tempRequests);
            setRequests(newSortedRequests);
        }
    };

    return (
        <div className="request-list">
            {showWarningDialog && (
                <WarningDialog
                    dialogTitle="This request has attached donation forms."
                    dialogText="It cannot be deleted until the amount contributed by all donation forms to this request is zero."
                    onClose={() => setShowWarningDialog(false)}
                />
            )}
            {requestSelectedForEditing && (
                <RequestForm
                    onSubmitComplete={() => {
                        window.location.reload();
                    }}
                    handleClose={() => setRequestSelectedForEditing("")}
                    operation="edit"
                    requestId={requestSelectedForEditing}
                />
            )}
            {requests.length === 0 ? (
                <p className="request-table-empty-message">There are currently no requests in this type</p>
            ) : (
                <Table responsive className="request-table">
                    <thead>
                        <tr>
                            {headingList.map((heading, index) => (
                                <th key={index} className="request-table th">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) =>
                            request.deletedAt == null ? (
                                <tr key={request._id}>
                                    <td>
                                        <div>
                                            <Form.Check
                                                type="checkbox"
                                                onClick={() => onFulfilledRequest(request)}
                                                defaultChecked={request.fulfilledAt != null}
                                            />
                                        </div>
                                    </td>
                                    {request.clientName !== null ? (
                                        <td style={request.fulfilledAt ? { opacity: 0.2 } : undefined}>
                                            <div className="row-text-style">{request.clientName}</div>
                                        </td>
                                    ) : (
                                        <td>N/A</td>
                                    )}
                                    <td style={request.fulfilledAt ? { opacity: 0.2 } : undefined}>
                                        {request.quantity}
                                    </td>
                                    <td style={request.fulfilledAt ? { opacity: 0.2 } : undefined}>
                                        {moment(request.createdAt, "x").format("MMMM DD, YYYY")}
                                    </td>
                                    <td>
                                        <div className="btn-cont">
                                            <td>
                                                <a
                                                    className="edit"
                                                    onClick={() => {
                                                        if (request._id) {
                                                            setRequestSelectedForEditing(request._id);
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </a>
                                            </td>
                                            <td>
                                                <a className="delete" onClick={() => handleDeleteRequest(index)}>
                                                    <i className="bi bi-trash"></i>
                                                </a>
                                            </td>
                                        </div>
                                    </td>
                                </tr>
                            ) : undefined
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default RequestsTable;
