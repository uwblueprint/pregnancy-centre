import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import moment from "moment";
import Table from "react-bootstrap/Table";

import Request from "../../data/types/request";
import RequestForm from "../organisms/RequestForm";

interface Props {
    requests: Request[];
    onChangeNumRequests?: (num: number) => void;
}

const RequestsTable: FunctionComponent<Props> = (props: Props) => {
    const [requestSelectedForEditing, setRequestSelectedForEditing] = useState("");

    const headingList = ["Fulfilled", "Client Name", "Quantity", "Date Requested", ""];
    const fulfillRequest = gql`
        mutation fulfillRequest($_id: ID) {
            fulfillRequest(_id: $_id) {
                _id
            }
        }
    `;
    const deleteRequest = gql`
        mutation deleteRequest($_id: ID) {
            deleteRequest(_id: $_id) {
                _id
            }
        }
    `;

    const [requests, setRequests] = useState(props.requests.filter((request) => request.deleted === false));

    useEffect(() => {
        const nonFulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilled === false) {
                    return request;
                }
            }
        });
        const fulfilledRequests = requests.filter((request) => {
            if (request !== undefined) {
                if (request.fulfilled === true) {
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
    }, []);

    const [mutateDeleteRequest] = useMutation(deleteRequest);
    const [mutateFulfillRequest] = useMutation(fulfillRequest);
    const onDeleteRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = { ...requestsCopy[index] };
        requestsCopy.splice(index, 1);
        const id = req._id;
        props.onChangeNumRequests!(requestsCopy.length);
        setRequests(requestsCopy);
        mutateDeleteRequest({ variables: { _id: id } });
    };
    const onFulfilledRequest = (index: number) => {
        const requestsCopy = requests.slice();
        const req = { ...requestsCopy[index] };
        if (req.fulfilled === false) {
            req.fulfilled = true;
            requestsCopy.splice(index, 1);
            let i = requestsCopy.length - 1;
            for (; i > -1; --i) {
                if (requestsCopy[i].fulfilled === false) break;
                else if (requestsCopy[i]!.createdAt!.valueOf() < req!.createdAt!.valueOf()) break;
            }
            requestsCopy.splice(i + 1, 0, req);
        } else {
            req.fulfilled = false;
            requestsCopy.splice(index, 1);
            let i = 0;
            for (; i < requestsCopy.length; ++i) {
                if (requestsCopy[i].fulfilled === true) break;
                else if (requestsCopy[i]!.createdAt!.valueOf() > req!.createdAt!.valueOf()) break;
            }
            requestsCopy.splice(i, 0, req);
        }
        setRequests(requestsCopy);
        const id = req._id;
        mutateFulfillRequest({ variables: { _id: id } });
    };

    return (
        <div className="request-list">
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
                            request.deleted === false ? (
                                <tr key={request._id}>
                                    <td>
                                        <div>
                                            <Form.Check
                                                type="checkbox"
                                                onClick={() => onFulfilledRequest(index)}
                                                defaultChecked={request.fulfilled}
                                            />
                                        </div>
                                    </td>
                                    {request.clientName !== null ? (
                                        <td style={requests[index].fulfilled ? { opacity: 0.2 } : undefined}>
                                            <div className="row-text-style">{request.clientName}</div>
                                        </td>
                                    ) : (
                                        <td>N/A</td>
                                    )}
                                    <td style={requests[index].fulfilled ? { opacity: 0.2 } : undefined}>
                                        {request.quantity}
                                    </td>
                                    <td style={requests[index].fulfilled ? { opacity: 0.2 } : undefined}>
                                        {moment(request.createdAt, "x").format("MMMM DD, YYYY")}
                                    </td>
                                    <td>
                                        <div className="btn-cont">
                                            <td>
                                                <a
                                                    className="request-table edit"
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
                                                <a
                                                    className="request-table delete"
                                                    onClick={() => onDeleteRequest(index)}
                                                >
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

            {/* TODO: Add Edit and Delete Request Modals here*/}
        </div>
    );
};

export default RequestsTable;
