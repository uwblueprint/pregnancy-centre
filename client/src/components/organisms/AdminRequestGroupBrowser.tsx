import { Dropdown, Spinner } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import DeleteRequestGroupDialog from "./DeleteRequestGroupDialog";
import RequestGroup from "../../data/types/requestGroup";
import RequestGroupForm from "./RequestGroupForm";
import RequestTypeDropdownList from "./RequestTypeDropdownList";
import RequestTypeForm from "./RequestTypeForm";

interface ParamTypes {
    id: string;
}

const AdminRequestGroupBrowser: FunctionComponent = () => {
    const { id } = useParams<ParamTypes>();
    const history = useHistory();
    const [requestGroup, setRequestGroup] = useState<RequestGroup | undefined>(undefined);
    const [numRequests, setNumRequests] = useState(0);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

    const query = gql`
        query requestGroup($id: ID) {
            requestGroup(_id: $id) {
                _id
                name
                deleted
                requestTypes {
                    _id
                    name
                    deletedAt
                    requests {
                        _id
                        createdAt
                        deletedAt
                        fulfilledAt
                        quantity
                        clientName
                        matchedDonations {
                            donationForm
                            quantity
                        }
                    }
                }
            }
        }
    `;

    const { error } = useQuery(query, {
        variables: { id: id },
        onCompleted: (data: { requestGroup: RequestGroup }) => {
            // deep-copy since data object is frozen
            const res: RequestGroup = JSON.parse(JSON.stringify(data.requestGroup));
            res.requestTypes = res.requestTypes?.filter((requestType) => requestType.deletedAt == null) ?? [];
            setRequestGroup(res);
        }
    });

    if (error) console.log(error.graphQLErrors);
    useEffect(() => {
        if (requestGroup !== undefined) {
            setNumRequests(
                requestGroup.requestTypes?.reduce((acc, requestType) => {
                    const nonDeletedRequests =
                        requestType.requests?.filter((request) => request.deletedAt == null) ?? [];
                    return acc + nonDeletedRequests.length;
                }, 0) ?? 0
            );
        }
    }, [requestGroup]);

    const deleteRequestGroupQuery = gql`
        mutation deleteRequestGroup($id: ID) {
            deleteRequestGroup(_id: $id) {
                _id
            }
        }
    `;
    const [mutateDeleteRequestGroup] = useMutation(deleteRequestGroupQuery);

    const deleteRequestGroup = async () => {
        await mutateDeleteRequestGroup({ variables: { id: requestGroup?._id } });
        history.goBack();
    };

    return (
        <div className="request-group-browser">
            {requestGroup === undefined ? (
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <div>
                    <div className="request-group-header">
                        <div className="request-group-description">
                            <h1 className="request-group-title">{requestGroup!.name}</h1>
                            <p>
                                Displaying {numRequests} total requests and {requestGroup.requestTypes?.length ?? 0}{" "}
                                types
                            </p>
                        </div>
                        <div>
                            <Dropdown className="request-group-button">
                                <Dropdown.Toggle bsPrefix="custom">
                                    <i className="bi bi-three-dots"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="right" className="request-group-button-dropdown">
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowEditGroupModal(true);
                                        }}
                                    >
                                        Edit Need
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowCreateTypeModal(true);
                                        }}
                                    >
                                        Create New Type
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="request-group-button-dropdown-item"
                                        onClick={() => {
                                            setShowDeleteGroupModal(true);
                                        }}
                                    >
                                        Delete Group
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    {showEditGroupModal && (
                        <RequestGroupForm
                            onSubmitComplete={() => {
                                window.location.reload();
                            }}
                            handleClose={() => {
                                setShowEditGroupModal(false);
                            }}
                            requestGroupId={requestGroup._id}
                            operation="edit"
                        ></RequestGroupForm>
                    )}
                    {showCreateTypeModal && (
                        <RequestTypeForm
                            handleClose={() => {
                                setShowCreateTypeModal(false);
                            }}
                            onSubmit={() => {
                                window.location.reload();
                            }}
                            requestGroup={requestGroup}
                            operation="create"
                        />
                    )}
                    {showDeleteGroupModal && (
                        <DeleteRequestGroupDialog
                            requestGroupName={requestGroup.name}
                            numRequests={numRequests}
                            handleClose={() => {
                                setShowDeleteGroupModal(false);
                            }}
                            onCancel={() => {
                                setShowDeleteGroupModal(false);
                            }}
                            onSubmit={() => {
                                deleteRequestGroup();
                            }}
                        />
                    )}
                    {requestGroup.requestTypes && (
                        <RequestTypeDropdownList
                            changeRequest={(num: number) => {
                                setNumRequests((old) => old + num);
                            }}
                            requestGroup={requestGroup}
                            requestTypes={requestGroup.requestTypes}
                        />
                    )}{" "}
                </div>
            )}
        </div>
    );
};

export default AdminRequestGroupBrowser;
